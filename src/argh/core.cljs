(ns argh.core
  (:require [clojure.string :as str])
  (:use-macros [argh.macros :only [with-path do-path for-loop]])
  )

(declare start)

(def input (atom #{}))
(def game (atom nil))

(defn fill-style [ctx color] (set! ctx.fillStyle color))
(defn stroke-style [ctx color] (set! ctx.strokeStyle color))
(defn set-font [ctx font] (set! ctx.font font))
(defn line-width [ctx wid] (set! ctx.lineWidth wid))
(defn fill-rect [ctx x y w h] (.fillRect ctx x y w h))
(defn clear-rect [ctx x y w h] (.clearRect ctx x y w h))
(defn move-to [ctx x y] (.moveTo ctx x y))
(defn line-to [ctx x y] (.lineTo ctx x y))
(defn stroke [ctx] (.stroke ctx))
(defn fill [ctx] (.fill ctx))
(defn context [cvs] (.getContext cvs "2d"))
(defn clear
  ([cvs col]
     (doto (context cvs) (fill-style col) (fill-rect 0 0 cvs.width cvs.height)))
  ([cvs]
     (doto (context cvs) (clear-rect 0 0 cvs.width cvs.height))))
(defn draw-poly [ctx pts]
  (with-path ctx
   (apply move-to ctx (first pts))
   (doseq [[x y] (rest pts)]
     (line-to ctx x y)))
  (fill ctx))
(defn draw-line
  [ctx col x0 y0 x1 y1]
  (doto ctx
    (line-width 0.5)
    (stroke-style col)
    (do-path
     (move-to x0 y0)
     (line-to x1 y1))
    stroke))
(defn write-centered [cvs txt]
  (let [ctx (context cvs) ]
    (doto ctx
      (fill-style "white")
      (set-font "30px sans-serif")
      (.fillText txt
                 (/ (- cvs.width (.. ctx (measureText txt) -width)) 2)
                 (/ cvs.height 2)))))
(def pi Math/PI)
(def two-pi (* pi 2))
(def half-pi (/ pi 2))
(def goal-fps 60)

(defn hypot [x y] (+ (* x x) (* y y)))

(defn ensure-circ [angle]
  (cond (or (== angle 0) (== angle two-pi)) 0
        (> two-pi angle 0) angle
        (> angle two-pi) (recur (- angle two-pi))
        (> 0 angle) (recur (+ angle two-pi))
        :else (throw "huh?")))

(defn up-right [angle]
  (let [a (ensure-circ angle)]
    [(not (<= 0 a pi)) (or (> a (* 0.75 two-pi)) (< a (* two-pi 0.25)))]))

(def animate
  (or (.-requestAnimationFrame js/window)
      (.-webkitRequestAnimationFrame js/window)
      (.-mozRequestAnimationFrame js/window)
      (.-oRequestAnimationFrame js/window)
      (.-msRequestAnimationFrame js/window)
      (fn [callback] (js/setTimeout callback 17))))

(def screen (.getElementById js/document "screen"))
(def fps-elem (.getElementById js/document "fps"))
(def map-canv (.getElementById js/document "map"))
(def ent-canv (.getElementById js/document "ent"))

(def screen-width (.-width screen))
(def screen-height (.-height screen))

(def scale 4)

(def view-width (/ screen-width scale))
(def view-height (/ screen-height scale))

(defn show-fps [fps]
  (set! (.-innerHTML fps-elem)
        (str (/ (Math/floor (* fps 100)) 100) " fps")))

(def ray-width 8)
(def fov (* 60 (/ Math/PI 180)))
(def rays (Math/ceil (/ screen-width ray-width)))
(def view-dist (/ (/ screen-width 2) (Math/tan (/ fov 2))))

(def texture-img
  (let [img (.createElement js/document "img")]
    (set! img.src "res/wall.png")
    (set! img.onload (fn [] (start)))
    img))
(def assets (js-obj))
(defn init-assets []
  (let [cvs (.createElement js/document "canvas")
        ctx (do (set! cvs.width 16) (set! cvs.height 16) (.getContext cvs "2d"))]
    (.drawImage ctx texture-img 0 0 16 16)
    (set! (.-floor assets) (.. ctx (getImageData 0 0 16 16) -data))))

(defrecord Player [x y rot xacc yacc rotacc])

(defn create-player [x y] (Player. (+ 0.5 x) (+ 0.5 y) (rand) 0 0 0))

(defn spawn-player [{:keys [w h data]}]
  (loop [x (rand-int w), y (rand-int h)]
    (if (== 0 (nth (data y) x)) (create-player x y)
        (recur (rand-int w) (rand-int h)))))
(defrecord Level [w h data]
  IFn
  (invoke [_ x y] (if-not (and (< -1 x w) (< -1 y h)) 2 (nth (nth data y) x))))
(defn rand-level [w h prob]
  (Level. w h (vec (repeatedly h (fn [] (vec (repeatedly w #(if (< (rand) prob)
                                                             0 1))))))))

(defrecord Game [player level])

(defn check-cell [x y {:keys [w h data]}]
  (and (< -1 x w) (< -1 y h) (zero? (nth (nth data y) x))))

(defn check-neighbors [x y l]
  (count (for [dx (range -1 2), dy (range -1 2)
               :when (and (not (== dx dy 0)) (check-cell (+ x dx) (+ y dy) l))]
           1)))

(defn level-generate [w h prob op n its]
  (loop [i 0, l (rand-level w h prob)]
    (if (> i its) l
        (let [x (rand-int w), y (rand-int h)]
          (recur (inc i)
                 (assoc-in l [:data y x]
                           (if (not= op (< (check-neighbors x y l) n))
                             0 1)))))))

(defn new-cave [w h]
  (update-in (level-generate w h 0.85 true 6 20000) [:data]
             (fn [data]
               (reduce (fn [v [x y]] (assoc-in v [y x] 2))
                       data
                       (concat (mapcat #(vector [0 %] [(dec w) %])
                                       (range h))
                               (mapcat #(vector [% 0] [% (dec h)])
                                       (range w)))))))

(defn new-game []
  (let [lvl (new-cave 60 60)]
    (Game. (spawn-player lvl) lvl)))
(defn free? [data x y]
  (let [x0 (Math/floor (+ x 0.5 -0.3))
        x1 (Math/floor (+ x 0.5 0.3))
        y0 (Math/floor (+ y 0.5 -0.3))
        y1 (Math/floor (+ y 0.5 0.3))]
    (not (or (pos? (nth (nth data y0) x0))
             (pos? (nth (nth data y0) x1))
             (pos? (nth (nth data y1) x0))
             (pos? (nth (nth data y1) x1))))))
(defn move* ; todo: remove repetition
  [{:keys [xacc yacc x y rot rotacc] :as player} {:keys [data]}]
  (let [xsteps (Math/floor (inc (Math/abs (* xacc 100))))
        [nx nxacc] (loop [i xsteps, x x]
                     (if (pos? i)
                       (if (free? data (+ x (* xacc (/ i xsteps))) y)
                         (recur (dec i) (+ x (* xacc (/ i xsteps))))
                         [x 0])
                       [x xacc]))
        ysteps (Math/floor (inc (Math/abs (* yacc 100))))
        [ny nyacc] (loop [i ysteps, y y]
                     (if (pos? i)
                       (if (free? data x (+ y (* yacc (/ i ysteps))))
                         (recur (dec i) (+ y (* yacc (/ i ysteps))))
                         [y 0])
                       [y yacc]))]
    (assoc player :x nx, :y ny, :xacc xacc, :yacc yacc)))

(defn ->num [input pos neg]
  (cond (input neg) -1
        (input pos) +1
        :else 0))

(defn move-player
  [{{:keys [x y rot] :as player} :player l :level :as game-state} i]
  (let [dx (->num i :strafel :strafer)
        dy (->num i :up :down)
        d2 (+ (* dx dx) (* dy dy))
        dd (if (pos? d2) (Math/sqrt d2) 1)
        dx (/ dx dd)
        dy (/ dy dd)
        r (* 0.05 (->num i :left :right))
        p (-> player
              (update-in [:rotacc] + r)
              (update-in [:xacc] - (* 0.03 (+ (* dx (Math/cos rot))
                                              (* dy (Math/sin rot)))))
              (update-in [:yacc] - (* 0.03 (- (* dy (Math/cos rot))
                                              (* dx (Math/sin rot))))))]
    (-> game-state
        (assoc-in [:player] (move* p l))
        (update-in [:player]
                   (fn [player]
                     (-> player
                         (update-in [:xacc] * 0.6)
                         (update-in [:yacc] * 0.6)
                         (update-in [:rot] + (get player :rotacc))
                         (update-in [:rotacc] * 0.4)))))))

(def decode {27 :escape, 38 :up, 40 :down, 37 :left, 39 :right
             65 :strafel 68 :strafer, 87 :up, 83 :down})

(defn buff [size init]
  (let [b (js/Array. size)]
    (dotimes [i size]
      (aset b i init))
    b))

(defn render ; big ol' graphics code blob
  [{{px :x py :y rot :rot :as player} :player
    {:keys [w h data] :as lvl} :level :as game-state}
   screen]
  (let [ctx (.getContext screen "2d")
        floor (.-floor assets)
        idata (.getImageData ctx 0 0 view-width view-height)
        pixels (.-data idata)
        z-buff (buff (* view-width view-height) 10000)
        z-buff-wall (buff (* view-width view-height) 0)
        x-cam (- px (* (Math/cos rot) 0.3))
        y-cam (- py (* (Math/sin rot) 0.3))
        x-center (/ view-width 2)
        y-center (/ view-height 3)
        r-cos (Math/cos rot)
        r-sin (Math/sin rot)
        fov view-height
        r 6
        xcent (Math/floor x-cam)
        zcent (Math/floor y-cam)
        render-wall (fn [x0 y0 x1 y1])] ;; todo
    ;; render the walls
    (when false
      (for-loop [(zb (- zcent r)) (<= zb (+ zcent r)) (inc zb)]
        (for-loop [(xb (- xcent r)) (<= xb (+ xcent r)) (inc xb)]
          (let [c (lvl xb zb); (nth (data zb) xb)
                e (lvl (inc xb) zb) ;(nth (data zb) (inc xb))
                s (lvl xb (inc zb));(nth (data (inc zb)) xb)
                ]
            (if (pos? c)
              (do (when-not (pos? e)
                    (render-wall (inc xb) (inc zb) (inc xb) zb))
                  (when-not (pos? s)
                    (render-wall xb (inc zb) (inc xb) (inc zb))))
              (do (when (pos? e)
                    (render-wall (inc xb) zb (inc xb) (inc zb)))
                  (when (pos? s)
                    (render-wall (inc xb) (inc zb) xb (inc zb)))))))))
    ;; render the floor
    (dotimes [y view-height]
      (let [yd (/ (- (+ y 0.5) y-center) fov)
            ceil? (pos? yd)
            row (* y view-width)
            zd (if ceil? (/ 4 (- yd)) (/ 4 yd))]
       (dotimes [x view-width]
         (when (> (aget z-buff (+ x row)) zd)
           (let [xd (* zd (/ (- x-center x) fov))
                 xx (+ (* xd r-cos) (* zd r-sin) (* 8 (+ 0.5 x-cam)))
                 yy (+ (* zd r-cos) (* xd r-sin -1) (* 8 (+ 0.5 y-cam)))
                 xpix (bit-shift-left xx 1)
                 ypix (bit-shift-left yy 1)
                 xt (bit-shift-right xpix 4)
                 yt (bit-shift-right ypix 4)
                ; block (lvl xt yt)
                                        ; (nth (data (min (dec w) (max 0 xt))) (min (dec
                                        ; h) (max 0 yt)))
                 ]
             (if false;(pos? block)
               (aset (+ x row) z-buff -1)
               (let [pix-start (* 4 (+ x row))
                     tex-start (* 4 (+ (bit-and xpix 15)
                                       (* 16 (bit-and ypix 15))))]
                 (aset z-buff (+ x row) zd)
                 (aset pixels pix-start (aget floor tex-start))
                 (aset pixels (+ 1 pix-start) (aget floor (+ 1 tex-start)))
                 (aset pixels (+ 2 pix-start) (aget floor (+ 2 tex-start)))
                 (aset pixels (+ 3 pix-start) 255))))))))
    (dotimes [i (* view-width view-height)]
      (let [cl (aget z-buff i)]
        (when true;(pos? cl)
          (let [xp (mod i view-width)
                yp (Math/floor (/ i view-width))
                xx (/ (- xp (/ view-width 2)) view-width)
                i4 (* i 4)
                r (aget pixels i4)
                g (aget pixels (+ 1 i4))
                b (aget pixels (+ 2 i4))
                dark (max 0 (min 255 (Math/floor (/ 60000 (* cl cl)))))
                ;; dark (Math/floor (- 300 (* cl 6 (inc (* xx xx 2)))))
                ;; dark (+ dark (bit-shift-right (bit-shift-left
                ;;                                (* 4 (bit-and (+ xp yp) 3))
                ;;                                4)
                ;;                               4))
                ;; dark (max 0 (min 255 dark))
                ;;                dn (max 0 (min 255 (Math/floor (/ 60000 cl))))
                ]
            (aset pixels i4 (Math/floor (/ (* r dark) 255)))
            (aset pixels (+ 1 i4) (Math/floor (/ (* g dark) 255)))
            (aset pixels (+ 2 i4) (Math/floor (/ (* b dark) 255)))))))
    (.putImageData ctx idata 0 0)))


(defn draw-minimap
  [{{px :x py :y r :rot} :player {:keys [w h data]} :level} cvs]
  (let [ctx (context cvs)
        scale (min (/ (.-width cvs) w) (/ (.-height cvs) h))]
    (clear cvs "white")
    (dotimes [j h]
      (let [row (nth data j)]
        (dotimes [i w]
          (doto ctx
            (fill-style (["white" "gray" "black"] (row i)))
            (fill-rect (* i scale) (* j scale) scale scale)))))))

(defn draw-ents [{{px :x py :y r :rot} :player {:keys [w h data]} :level} cvs]
  (let [scale (min (/ (.-width cvs) w) (/ (.-height cvs) h))]
    (clear cvs)
    (doto (context cvs)
      (fill-style "black")
      (stroke-style "black")
      (fill-rect (- (* px scale) 2) (- (* py scale) 2) 4 4))))

(defn tick [game input] (-> game (move-player input)))
(def last-tick (atom (.getTime (js/Date.))))

(def draw-cvs
  (let [dc (.createElement js/document "canvas")]
    (set! dc.width view-width)
    (set! dc.height view-height)
    dc))

(defn game-loop []
  (when-not (:escape @input)
    (let [current-tick (.getTime (js/Date.))
          fps (/ 1000 (- current-tick @last-tick))
          needed (* (/ goal-fps 1000) (- current-tick @last-tick))]
      (show-fps fps)
      (swap! game #(loop [n needed, g %]
                     (if (< 0 n) (recur (dec n) (tick g @input))
                         g)))
      (reset! last-tick (.getTime (js/Date.)))
      (draw-ents @game ent-canv)
;      (draw-ents @game ent-canv)
      (clear draw-cvs)
      (animate game-loop)
      (render @game draw-cvs)
      (.. screen
          (getContext "2d")
          (drawImage draw-cvs 0 0 screen-width screen-height)))))

(defn start-listening []
  (let [on-key #(fn [e]
;                  (.log js/console e)
                  (swap! input % (decode (.-keyCode e)))
                  (.preventDefault e))]
    (set! (.-onkeydown js/document) (on-key conj))
    (set! (.-onkeyup js/document) (on-key disj))))

(defn loading [txt]
  (clear screen "black")
  (write-centered screen txt))

(loading "Loading assets, generating level, etc...")

(defn start []
  (init-assets)
  (start-listening)
  (reset! game (new-game))
  (draw-minimap @game map-canv)
  (loading "Finished loading.")
  (animate game-loop))
