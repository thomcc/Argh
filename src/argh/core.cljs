(ns argh.core
  (:require [clojure.string :as str])
  (:use-macros [argh.macros :only [with-path do-path]])
  ;; (:require [clojure.browser.repl :as repl])
  )

; (repl/connect "http://localhost:9000/repl")

(def input (atom #{}))
(def game (atom nil))

(defn fill-style [ctx color] (set! ctx.fillStyle color))
(defn stroke-style [ctx color] (set! ctx.strokeStyle color))
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

(def pi Math/PI)
(def two-pi  (* pi 2))
(def half-pi (/ pi 2))
(def goal-fps 60)
(def screen-width 720)
(def screen-height 480)
(defn hypot [x y] (+ (* x x) (* y y)))

(defn ensure-circ [angle]
  (cond (or (== angle 0) (== angle two-pi)) 0
        (> two-pi angle 0) angle
        (> angle two-pi) (recur (- angle two-pi))
        (> 0 angle) (recur (+ angle two-pi))
        :else (throw "huh?")))

(defn up-right [angle]
  (let [a (ensure-circ angle)]
    [(<= 0 a pi) (or (> a (* 0.75 two-pi)) (< a (* two-pi 0.25)))]))

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

(defn show-fps [fps] (set! (.-innerHTML fps-elem)
                           (str (/ (Math/floor (* fps 100)) 100) " fps")))

(def ray-width 10)

(def fov (* 60 (/ Math/PI 180)))
(def rays (Math/ceil (/ screen-width ray-width)))
(def view-dist (/ (/ screen-width 2) (Math/tan (/ fov 2))))

(def bars
  (loop [i 0, s []]
    (if (> i screen-width) s
        (let [img (.createElement js/document "img")]
          (set! (.-cssText (.-style img))
                "position: absolute; height: 0px; left: 0px; top: 0px")
          (set! (.-src img) "res/wall.png")
          (.appendChild screen img)
          (recur (+ i ray-width) (conj s img))))))

(defrecord Player [x y rot move-speed rot-speed])
(defn create-player [x y] (Player. (+ 0.5 x) (+ 0.5 y) (rand) 0.08 (* 3 (/ pi 180))))
(defn spawn-player [{:keys [w h data]}]
  (loop [x (rand-int w), y (rand-int h)]
    (if (== 0 (nth (data y) x)) (create-player x y)
        (recur (rand-int w) (rand-int h)))))
(defrecord Level [w h data])
(defn rand-level [w h prob]
  (Level. w h (vec (repeatedly h (fn [] (vec (repeatedly w #(if (< (rand) prob) 0 1))))))))

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
                       (concat (mapcat #(vector [0 %] [(dec w) %]) (range h))
                               (mapcat #(vector [% 0] [% (dec h)]) (range w)))))))

(defn new-game []
  (let [lvl (new-cave 60 60)]
    (Game. (spawn-player lvl) lvl)))

(defn free? [{:keys [w h data] :as level} x y]
  (and (not (neg? x)) (not (neg? y)) (> h y) (> w x)
       (zero? (nth (nth data (Math/floor y)) (Math/floor x)))))

(defn move*
  [{{:keys [x y] :as player} :player l :level :as gs} dx dy]
  (if (free? l (+ dx x) (+ dy y))
    (-> gs (assoc-in [:player :x] (+ dx x)) (assoc-in [:player :y] (+ dy y)))
    gs))

(defn move-player
  [{{:keys [x y move-speed rot-speed rot] :as player} :player :as game-state} input]
  (let [speed (cond (input :down) -1, (input :up) 1, :else 0)
        dir (cond (input :left) -1, (input :right) 1, :else 0)
        move-step (* speed move-speed)
        rot (ensure-circ (+ rot (* dir rot-speed)))]
    (-> game-state
        (assoc-in [:player :rot] rot)
        (move* (* move-step (Math/cos rot)) 0)
        (move* 0 (* move-step (Math/sin rot))))))

(def decode {27 :escape, 38 :up, 40 :down, 37 :left, 39 :right})
;; return type of cast-out.  this program is hacked together so
;; it needs this many :/
(defrecord Ray [xh yh wx wy dist])

(defn render ; big ol' graphics code blob
  [{{px :x py :y rot :rot :as player} :player
    {:keys [w h data]} :level
    :as game-state}]
  (clear ent-canv)
  (dotimes [num rays]
    (let [scrpos (* ray-width (+ num (/ rays -2)))
          vdist (Math/sqrt (hypot scrpos view-dist))
          angle (+ rot (Math/asin (/ scrpos vdist)))
          cast-out
          (fn [x y, dx dy, dwx dwy]
            (loop [x x, y y]
              (if-not (and (< 0 x w) (< 0 y h)) (Ray. 0 0 0 0 0)
                      (let [wx (Math/floor (+ dwx x)), wy (Math/floor (+ dwy y))]
                        (if (pos? (nth (nth data wy) wx))
                          (Ray. x y wx wy (hypot (- x px) (- y py)))
                          (recur (+ x dx) (+ y dy)))))))
          [up? right?] (up-right angle)
          slope (Math/tan angle)
          x (if right? (Math/ceil px) (Math/floor px))
          {dist1 :dist xtex1 :yh :as hit1}
          (cast-out x
                    (+ py (* (- x px) slope))
                    (if right? 1 -1)
                    (* (if right? 1 -1) slope)
                    (if right? 0 -1)
                    0)
          xtex1 (if-not right? (mod xtex1 1) (- 1 (mod xtex1 1)))
          y (if up? (Math/ceil py) (Math/floor py))
          {dist2 :dist xtex2 :xh :as hit2}
          (cast-out (+ px (/ (- y py) slope))
                    y
                    (/ (if up? 1 -1) slope)
                    (if up? 1 -1)
                    0
                    (if up? 0 -1))
          xtex2 (if up? (- 1 (mod xtex2 1)) (mod xtex2 1))
          vert? (or (zero? dist1) (and (pos? dist2) (< dist2 dist1)))
          xtxt (if vert? xtex1 xtex2)
          {:keys [xh yh wx wy dist]} (if vert? hit2 hit1)
          ;; wall (nth (data wy) wx)
          ]
      (when-not (zero? dist)
        (doto (context ent-canv)
          (draw-line (if vert? "red" "green") (* 4 px) (* 4 py) (* 4 xh) (* 4 yh)))
        (let [bar (nth bars num)
              dist (* (Math/sqrt dist) (Math/cos (- rot angle)))
              height (Math/round (/ view-dist dist))
              width (* height (inc ray-width))
              style-top (Math/round (/ (- screen-height height) 2))
              style-height (bit-shift-right height 0)
              texx (Math/round (* xtxt (* height ray-width)))
              style-width (bit-shift-right (* width 2) 0)
              style-left (- (* num ray-width) texx)
              z-index (bit-shift-right (- (* 1000 (hypot (- px xh) (- py yh)))) 0)
              style-clip (str "rect(0px, " (+ (inc ray-width) texx) "px, "
                              height "px, " texx "px)")
              style (.-style bar)]
          (set! style.height (str style-height "px"))
          (set! style.width (str style-width "px"))
          (set! style.top (str style-top "px"))
          (set! style.left (str style-left "px"))
          (set! style.clip style-clip)
          (set! style.zIndex z-index))))))


(defn draw-minimap [{{px :x py :y r :rot} :player {:keys [w h data]} :level} cvs]
  (let [ctx (context cvs), scale (min (/ (.-width cvs) w) (/ (.-height cvs) h))]
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
      (render @game screen)
      (animate game-loop))))

(defn start-listening []
  (let [on-key #(fn [e] (swap! input % (decode (.-keyCode e))) (.preventDefault e))]
    (set! (.-onkeydown js/document) (on-key conj))
    (set! (.-onkeyup js/document) (on-key disj))))

(start-listening)
(reset! game (new-game))
(draw-minimap @game map-canv)
(animate game-loop)
