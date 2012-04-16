(ns argh.game
  (:use [argh.level :only [new-cave open-pos]]))

(defrecord Player [x y z rot xacc yacc rotacc walk walkphase])

(defn spawn-player [level]
  (let [[x y] (open-pos level)]
    (Player. x y 0 (rand) 0 0 0 0 0)))

(defrecord Game [player level])

(defn new-game []
  (let [lvl (new-cave 60 60)]
    (Game. (spawn-player lvl) lvl)))

(defn free? [lvl x y]
  (let [x0 (Math/floor (- (+ 0.5 x) 0.3)), x1 (Math/floor (+ (+ 0.5 x) 0.3))
        y0 (Math/floor (- (+ 0.5 y) 0.3)), y1 (Math/floor (+ (+ 0.5 y) 0.3))]
    (not (or (pos? (lvl x0 y0)) (pos? (lvl x1 y0))
             (pos? (lvl x0 y1)) (pos? (lvl x1 y1))))))

(defn move* ; todo: remove repetition
  [{:keys [xacc yacc x y rot rotacc] :as player} level]
  (let [xsteps (Math/floor (inc (Math/abs (* xacc 100))))
        [nx nxacc]
        (loop [i xsteps, x x, xacc xacc]
          (cond
           (zero? i) [x xacc]
           (free? level (+ x (* xacc (/ i xsteps))) y) [(+ x (* xacc (/ i xsteps))) xacc]
           :else (recur (dec i) x 0)))
        ysteps (Math/floor (inc (Math/abs (* yacc 100))))
        [ny nyacc]
        (loop [i ysteps, y y, yacc yacc]
          (cond
           (zero? i) [y yacc]
           (free? level x (+ y (* yacc (/ i ysteps)))) [(+ y (* yacc (/ i ysteps))) yacc]
           :else (recur (dec i) y 0)))]
    (assoc player :x nx, :y ny, :xacc xacc, :yacc yacc)))

(defn ->num [input pos neg]
  (cond (input neg) -1
        (input pos) +1
        :else 0))



(defn move-player
  [{{:keys [x y rot rotacc] :as player} :player l :level :as game-state} i]
  (let [dx (->num i :strafer :strafel)
        dy (->num i :down :up)
        d2 (+ (* dx dx) (* dy dy))
        dd (if (pos? d2) (Math/sqrt d2) 1)
        dx (/ dx dd)
        dy (/ dy dd)
        r (* 0.05 (->num i :left :right))
        move (Math/sqrt (+ (* dx dx) (* dy dy)))
        p (-> player
              (update-in [:walk] * 0.6)
              (update-in [:walk] + move)
              (update-in [:walkphase] + move)
              (update-in [:rotacc] + r)
              (update-in [:xacc] - (* 0.03 (+ (* dx (Math/cos rot))
                                              (* dy (Math/sin rot)))))
              (update-in [:yacc] - (* 0.03 (- (* dy (Math/cos rot))
                                              (* dx (Math/sin rot))))))
        gs-now
        (-> game-state
            (assoc-in [:player] (move* p l))
            (update-in [:player]
                       (fn [player]
                         (-> player
                             (update-in [:xacc] * 0.6)
                             (update-in [:yacc] * 0.6)
                             (update-in [:rot] + rotacc)
                             (update-in [:rotacc] * 0.4)))))]
    (when (> move 0.7)
      (.play (.getElementById js/document "step")))
    gs-now))

(defn tick [game input] (-> game (move-player input)))
