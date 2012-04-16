(ns argh.level)

(defrecord Level [w h data]
  IFn
  (invoke [_ x y]
    (if (and (< -1 x w) (< -1 y h))
      (aget (aget data y) x)
      #_(nth (nth data y) x)
      2)))

(defn level [w h data] (Level. w h data
                               #_(vec (map vec data))))

(defn check-neighbors [x y lvl]
  (let [a (array)]
    (loop [dy -1]
      (when (>= 1 dy)
        (loop [dx -1]
          (when (>= 1 dx)
            (when (and (not (== dx dy 0))
                       (zero? (aget (aget lvl (+ y dy)) (+ x dx))))
              (.push a :found))
            (recur (inc dx))))
        (recur (inc dy))))
    (.-length a))
 #_(count
    (for [dx (range -1 2), dy (range -1 2)
          :when (and (not (== dx dy 0))
                     (zero? (aget (aget level (+ y dy)) (+ x dx))))]
      1)))

(defn- build-array-2d [w h func]
  (let [a (js/Array. h)]
    (dotimes [j h]
      (let [row (js/Array. w)]
        (aset a j row)
        (dotimes [i w]
          (aset row i (func i j)))))
    a))

(defn generate [its op n w h map]
  (dotimes [i its]
    (let [x (inc (rand-int (- w 2))), y (inc (rand-int (- h 2)))]
     (aset (aget map y) x
           (if (not= op (< (check-neighbors x y map) n))
             0 1))))
  map)

(defn outline [w h map]
  (dotimes [i w]
    (aset (aget map 0) i 2)
    (aset (aget map (dec h)) i 2))
  (dotimes [j h]
    (aset (aget map j) 0 2)
    (aset (aget map j) (dec w) 2))
  map)

(defn level-generate [w h prob op n its]
  (->> (build-array-2d w h #(if (< (rand) prob) 0 1))
       (generate its op n w h)
       (outline w h)
       (level w h)))

(defn new-cave [w h] (level-generate w h 0.85 true 6 20000))

(defn open-pos [{:keys [w h] :as lvl}]
  (let [open (array)]
    (dotimes [i w]
      (dotimes [j h]
        (when (zero? (lvl i j))
          (.push open [i j]))))
    (rand-nth open)))