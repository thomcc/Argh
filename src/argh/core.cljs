(ns argh.core
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


(defn fill-style [ctx color] (set! ctx.fillStyle color) ctx)
(defn stroke-style [ctx color] (set! ctx.strokeStyle color) ctx)
(defn line-width [ctx wid] (set! ctx.lineWidth wid) ctx)
(defn fill-rect [ctx x y w h] (.fillRect ctx x y w h) ctx)
(defn clear-rect [ctx x y w h] (.clearRect ctx x y w h) ctx)
(defn move-to [ctx x y] (.moveTo ctx x y) ctx)
(defn line-to [ctx x y] (.lineTo ctx x y) ctx)
(defn stroke [ctx] (.stroke ctx))
(defn context [canvas] (.getContext canvas "2d"))
(defn clear [canvas]
  (-> (context canvas) (clear-rect 0 0 canvas.width canvas.height)))

(defn draw-line
  [x0 y0 x1 y1 canvas scale col]
  (doto (context canvas)
    (stroke-style col)
    (line-width 0.5)
    (with-path
      (move-to (* x0 scale) (* y0 scale))
      (line-to (* x1 scale) (* y1 scale)))
    stroke))

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
          :else [false true]))) ; (<= (* 3 half-pi) a two-pi)
(defn wait [ms func] (js* "setTimeout(~{func}, ~{ms})"))
(def map-canvas (.getElementById js/document "map"))
(def ent-canvas (.getElementById js/document "entities"))

(def ray-width 8)
(def fov (* 60 (/ Math/PI 180)))
(def rays (Math/ceil (/ (.-width ent-canvas) ray-width)))
(def view-dist (/ (/ (.-width ent-canvas) 2) (Math/tan (/ fov 2))))

(defrecord Player [x y rot move-speed rot-speed])
(defn spawn-player [x y] (Player. x y (rand) 0.18 (* 6 (/ pi 180))))
(defrecord Level [w h data])
(defn make-level [data]
  (Level. (count (nth data 0)) (count data) data))
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

(defn draw-map
  [{:keys [w h data]} canvas]
  (let [ctx (context canvas)
        scale (min (/ canvas.width w) (/ canvas.height h))]
    (-> ctx (fill-style "white") (fill-rect 0 0 canvas.width canvas.height))
    (dotimes [y h]
      (dotimes [x w]
        (when (> (nth (nth data y) x) 0)
          (-> ctx
              (fill-style "gray")
              (fill-rect (* x scale) (* y scale) scale scale)))))))

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
  [{{px :x py :y :as player} :player, {:keys [w h data]} :level} angle canvas]
  (let [scale (min (/ canvas.width w) (/ canvas.height h))
        cast-out
        (fn [x y, dx dy, dwx dwy]
          (loop [x x, y y]
            (if-not (and (< 0 x w) (< 0 y h)) [x y 0]
                    (let [wx (Math/floor (+ dwx x)), wy (Math/floor (+ dwy y))]
                      (if (pos? (nth (nth data wy) wx)) [x y (hypot (- x px) (- y py))]
                          (recur (+ x dx) (+ y dy)))))))
        [up? right?] (up-right angle)
        slope (Math/tan angle)
        x (if right? (Math/ceil px) (Math/floor px))
        [xhit1 yhit1 hitdist1 :as hit1]
        (cast-out x (+ py (* (- x px) slope))
                  (if right? 1 -1) (* (if right? 1 -1) slope)
                  (if right? 0 -1) 0)
        y (if up? (Math/ceil py) (Math/floor py))
        [xhit2 yhit2 hitdist2 :as hit2]
        (cast-out (+ px (/ (- y py) slope)) y
                  (/ (if up? 1 -1) slope) (if up? 1 -1)
                  0 (if up? 0 -1))
        [xhit yhit hitdist]
        (if (or (zero? hitdist1) (and (pos? hitdist2) (< hitdist2 hitdist1))) hit2 hit1)]
    (when-not (zero? hitdist)
      (draw-line px py xhit yhit canvas scale "blue"))))

(defn cast-rays
  [{{:keys [rot] :as player} :player :as game-state} canvas]
  (clear canvas)
  (dotimes [i rays]
    (let [scrpos (* ray-width (+ i (/ rays -2)))
          vdist (Math/sqrt (hypot scrpos view-dist))]
      (cast-ray game-state (+ rot (Math/asin (/ scrpos vdist))) canvas))))

(defn tick [game input]
  (-> game (move-player input)))

(defn game-loop []
  (swap! game tick @input)
  (cast-rays @game ent-canvas)
  (when-not (:escape @input)
    (wait (/ 1000 30) game-loop)))

(defn start-listening []
  (let [on-key #(fn [e] (swap! input % (decode (.-keyCode e))) (.preventDefault e))]
   (set! (.-onkeydown js/document) (on-key conj))
   (set! (.-onkeyup js/document) (on-key disj))))

(start-listening)
(reset! game (new-game))
(draw-map (:level @game) map-canvas)
(wait (/ 1000 30) game-loop)



