(ns argh.core
  (:require [clojure.string :as str])
  (:use-macros [argh.macros :only [with-path]])
  ;; (:require [clojure.browser.repl :as repl])
  )

; (repl/connect "http://localhost:9000/repl")

(def input (atom #{}))
(def game (atom nil))



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
    (cond (<= 0 a half-pi) [true true]
          (<= half-pi a pi) [true false]
          (<= pi a (* 3 half-pi)) [false false]
          :else [false true])))
(def animate ;
  (or (.-requestAnimationFrame js/window)
      (.-webkitRequestAnimationFrame js/window)
      (.-mozRequestAnimationFrame js/window)
      (.-oRequestAnimationFrame js/window)
      (.-msRequestAnimationFrame js/window)
      (fn [callback] (js/setTimeout callback 17))))
(def screen (.getElementById js/document "screen"))
(def fps-elem (.getElementById js/document "fps"))
(defn show-fps [fps] (set! (.-innerHTML fps-elem) (str (/ (Math/floor (* fps 100)) 100) " fps")))
(def ray-width 4)
(def fov (* 60 (/ Math/PI 180)))
(def rays (Math/ceil (/ screen-width ray-width)))
(def view-dist (/ (/ screen-width 2) (Math/tan (/ fov 2))))
(def bars
  (loop [i 0, s []]
    (if (> i screen-width) s
        (let [d (.createElement js/document "div")
              img (js/Image.)]
          (doto (.-style d)
            (aset "position" "absolute")
            (aset "left" (str i "px"))
            (aset "width" (str (inc ray-width) "px"))
            (aset "overflow" "hidden"))
          (doto (.-style img)
            (aset "position" "absolute")
            (aset "left" "0px"))
          (set! (.-src img) "res/wall3.png")
          (set! (.-img d) img)
          (.appendChild d img)
          (.appendChild screen d)
          (recur (+ i ray-width) (conj s d))))))

(defrecord Player [x y rot move-speed rot-speed])
(defn spawn-player [x y] (Player. x y (rand) 0.18 (* 6 (/ pi 180))))
(defrecord Level [w h data])

(defn make-level [data] (Level. (count (nth data 0)) (count data) data))
(defn empty-level [w h] (Level w h (vec (repeatedly h #(vec (repeat w 0))))))

(defrecord Game [player level])

(defn new-game []
  (Game. (spawn-player 10 11)
         (make-level [[1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1]
                      [1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 0 0 3 3 3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 0 0 3 0 3 0 0 1 1 1 2 1 1 1 1 1 2 1 1 1 2 1 0 0 0 0 0 0 0 0 1]
                      [1 0 0 3 0 4 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 0 0 0 0 3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 0 0 0 0 3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 1 1 1 1 1]
                      [1 0 0 3 0 3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 0 0 3 0 4 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2]
                      [1 0 0 3 0 3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 0 0 3 3 3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 1 1 1 1 1]
                      [1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 0 0 0 0 0 0 0 0 3 3 3 0 0 3 3 3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2]
                      [1 0 0 0 0 0 0 0 0 3 3 3 0 0 3 3 3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 0 0 0 0 0 0 0 0 3 3 3 0 0 3 3 3 0 0 0 0 0 0 0 0 0 3 1 1 1 1 1]
                      [1 0 0 0 0 0 0 0 0 3 3 3 0 0 3 3 3 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 0 0 4 0 0 4 2 0 2 2 2 2 2 2 2 2 0 2 4 4 0 0 4 0 0 0 0 0 0 0 1]
                      [1 0 0 4 0 0 4 0 0 0 0 0 0 0 0 0 0 0 0 0 4 0 0 4 0 0 0 0 0 0 0 1]
                      [1 0 0 4 0 0 4 0 0 0 0 0 0 0 0 0 0 0 0 0 4 0 0 4 0 0 0 0 0 0 0 1]
                      [1 0 0 4 0 0 4 0 0 0 0 0 0 0 0 0 0 0 0 0 4 0 0 4 0 0 0 0 0 0 0 1]
                      [1 0 0 4 3 3 4 2 2 2 2 2 2 2 2 2 2 2 2 2 4 3 3 4 0 0 0 0 0 0 0 1]
                      [1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
                      [1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1]])))


(defn free? [{:keys [w h data]} x y]
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

(defn cast-rays ; enormous graphics code blob
  [{{px :x py :y rot :rot :as player} :player
    {:keys [w h data]} :level
    :as game-state}]
  (let [scale (min (/ screen-width w) (/ screen-height h))]
    (dotimes [num rays]
      (let [scrpos (* ray-width (+ num (/ rays -2)))
            vdist (Math/sqrt (hypot scrpos view-dist))
            angle (+ rot (Math/asin (/ scrpos vdist)))
            scale (min (/ screen-width w) (/ screen-height h))
            cast-out
            (fn [x y, dx dy, dwx dwy]
              (loop [x x, y y]
                (if-not (and (< 0 x w) (< 0 y h)) [x y 0 0] ; getting absurd...
                        (let [wx (Math/floor (+ dwx x)), wy (Math/floor (+ dwy y))]
                          (if (pos? (nth (nth data wy) wx))
                            [x y (hypot (- x px) (- y py)) (nth (nth data wy) wx) (mod x 1) (mod y 1)]
                            (recur (+ x dx) (+ y dy)))))))
            [up? right?] (up-right angle)
            slope (Math/tan angle)
            x (if right? (Math/ceil px) (Math/floor px))
            [xhit1 yhit1 hitdist1 wall1 _ xtxt1 :as hit1]
            (cast-out x (+ py (* (- x px) slope))
                      (if right? 1 -1) (* (if right? 1 -1) slope)
                      (if right? 0 -1) 0)
            y (if up? (Math/ceil py) (Math/floor py))
            [xhit2 yhit2 hitdist2 wall2 xtxt2 _ :as hit2]
            (cast-out (+ px (/ (- y py) slope)) y
                      (/ (if up? 1 -1) slope) (if up? 1 -1)
                      0 (if up? 0 -1))
            vert? (or (zero? hitdist1) (and (pos? hitdist2) (< hitdist2 hitdist1)))
            xtxt (if vert? xtxt2 xtxt1)
            [xhit yhit hitdist wall] (if vert? hit2 hit1)]
        (when-not (zero? hitdist)
          (let [s (nth bars num)
                d (* (Math/cos (- rot angle)) (Math/sqrt hitdist))
                ht (Math/round (/ view-dist d))
                wd (* ht ray-width)
                top (Math/round (/ (- screen-height ht) 2))
                tx (* xtxt wd)
                bar (nth bars num)]
            (set! (.-cssText (.-style bar)) ;; (.join (array ...)) seems to be at least 3* as fast as str.
                  (.join (array "position: absolute; left: " (* num ray-width) "px; height: " ht "px; width:"
                                (inc ray-width) "px; top: " top "px; overflow: hidden") ""))
            (set! (.-cssText (.-style (.-img bar)))
                  (.join (array "position: absolute; height: " ht "px; width: " (* wd 2) "px; left: "
                                (- tx) "px; top: 0px;") ""))))))))

(defn tick [game input] (-> game (move-player input)))

(def last-tick (atom (.getTime (js/Date.))))

(defn game-loop []
  (when-not (:escape @input)
    (let [current-tick (.getTime (js/Date.))
          fps (/ 1000 (- current-tick @last-tick))
          needed (* (/ goal-fps 1000) (- current-tick @last-tick))]
      (show-fps fps)
      (swap! game
             (fn [g-state]
               (loop [n needed, g g-state]
                 (if (< 0 n) (recur (dec n) (tick g @input))
                     g))))
      (reset! last-tick (.getTime (js/Date.)))
      (cast-rays @game screen)
      (animate game-loop))))

(defn start-listening []
  (let [on-key #(fn [e] (swap! input % (decode (.-keyCode e))) (.preventDefault e))]
   (set! (.-onkeydown js/document) (on-key conj))
   (set! (.-onkeyup js/document) (on-key disj))))

(start-listening)
(reset! game (new-game))

(animate game-loop)
