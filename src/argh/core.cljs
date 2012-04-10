(ns argh.core
  (:require [clojure.string :as str])
  (:use-macros [argh.macros :only [with-path]])
  ;; (:require [clojure.browser.repl :as repl])
  )

; (repl/connect "http://localhost:9000/repl")

(def input (atom #{}))
;(def player (atom nil))
(def game (atom nil))
(def pi Math/PI)
(def two-pi  (* pi 2))
(def half-pi (/ pi 2))
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
(defn wait [ms func] (js* "setTimeout(~{func}, ~{ms})"))

(def screen (.getElementById js/document "screen"))
(def ray-width 16)
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
            (aset "width" (str ray-width "px"))
            (aset "overflow" "hidden"))
          (doto (.-style img)
            (aset "position" "absolute")
            (aset "left" "0px"))
          (set! (.-src img) "res/wall.png")
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
    (-> gs
        (assoc-in [:player :x] (+ dx x))
        (assoc-in [:player :y] (+ dy y)))
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

(defn cast-ray
  [{{px :x py :y rot :rot :as player} :player, {:keys [w h data]} :level} angle num]
  (let [scale (min (/ screen-width w) (/ screen-height h))
        cast-out
        (fn [x y, dx dy, dwx dwy]
          (loop [x x, y y]
            (if-not (and (< 0 x w) (< 0 y h)) [x y 0 0] ; getting absurd...
                    (let [wx (Math/floor (+ dwx x)), wy (Math/floor (+ dwy y))]
                      (if (pos? (nth (nth data wy) wx))
                        [x y (hypot (- x px) (- y py)) (nth (nth data wy) wx)]
                        (recur (+ x dx) (+ y dy)))))))
        [up? right?] (up-right angle)
        slope (Math/tan angle)
        x (if right? (Math/ceil px) (Math/floor px))
        [xhit1 yhit1 hitdist1 wall1 :as hit1]
        (cast-out x (+ py (* (- x px) slope))
                  (if right? 1 -1) (* (if right? 1 -1) slope)
                  (if right? 0 -1) 0)
        y (if up? (Math/ceil py) (Math/floor py))
        [xhit2 yhit2 hitdist2 wall2 :as hit2]
        (cast-out (+ px (/ (- y py) slope)) y
                  (/ (if up? 1 -1) slope) (if up? 1 -1)
                  0 (if up? 0 -1))
        [xhit yhit hitdist wall horiz xtx]
        (if (or (zero? hitdist1) (and (pos? hitdist2) (< hitdist2 hitdist1)))
          (conj hit2 (if up? 1 0) false (mod yhit2 1))
          (conj hit1 (if right? 1 0)) true (mod xhit1 1))]
    (when-not (zero? hitdist)
      (let [s (nth bars num)
            d (* (Math/cos (- rot angle)) (Math/sqrt hitdist))
            ht (Math/round (/ view-dist d))
            wd (* ht ray-width)
            top (Math/round (/ (- screen-height ht) 2))
            tx (Math/round (* xtx wd))
            bar (nth bars num)]
        (doto (.-style bar)
          (aset "height" (str ht "px"))
          (aset "top" (str top "px")))
        (doto (.-style (.-img bar))
          (aset "height" (str ht "px"))
          (aset "width" (str (* wd 2) "px"))
          (aset "top" "0px")
          (aset "left" (str (- (if (< tx (- wd ray-width)) (- wd ray-width) tx)) "px")))))))

(defn cast-rays
  [{{:keys [rot] :as player} :player :as game-state}]
  (dotimes [i rays]
    (let [scrpos (* ray-width (+ i (/ rays -2)))
          vdist (Math/sqrt (hypot scrpos view-dist))]
      (cast-ray game-state (+ rot (Math/asin (/ scrpos vdist))) i))))

(defn tick [game input]
  (-> game (move-player input)))

(defn game-loop []
  (swap! game tick @input)
  (cast-rays @game screen)
  (when-not (:escape @input)
    (wait (/ 1000 30) game-loop)))

(defn start-listening []
  (let [on-key #(fn [e] (swap! input % (decode (.-keyCode e))) (.preventDefault e))]
   (set! (.-onkeydown js/document) (on-key conj))
   (set! (.-onkeyup js/document) (on-key disj))))

(start-listening)
(reset! game (new-game))

(wait (/ 1000 30) game-loop)



