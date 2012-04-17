(ns argh.level
  (:use [argh.core :only [debug?]]))

(defrecord Level [w h data]
  Object
  (toString [_]
    (let [strary (array (str "Width: " w ". Height: " h "."))]
      (dotimes [j h]
        (let [rowstrary (array)
              row (aget data j)]
          (dotimes [i w]
            (.push rowstrary (condp == (aget row i) 0 ".", 1 "#", 2 "$", "?")))
          (.push strary (.join rowstrary ""))))
      (.join strary \newline)))
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
  (let [lvl (->> (build-array-2d w h #(if (< (rand) prob) 0 1))
                 (generate its op n w h)
                 (outline w h)
                 (level w h))]
;    (pr (.toString lvl))
    lvl))

(defn new-cave [w h] (level-generate w h 0.85 true 6 25000))
(defn copy [a] (amap a i ret (aclone (aget ret i))))

(defn open-pos [{:keys [w h] :as lvl}]
  (let [cp (copy (get lvl :data))
        largest-open (atom [-1 -1])
        largest-size (atom -1)]
    (dotimes [i w]
      (dotimes [j h]
        (when (and (zero? (aget (aget cp j) i)) (zero? (lvl i j)))
          (let [box (atom 0)]
            (fill-open i j lvl cp box)
            (when (> @box @largest-size)
              (reset! largest-size @box)
              (reset! largest-open [i j]))))))
    @largest-open))

(defn fill-open [x y lvl ary found-atom]
  (loop [stk [[x y]]]
    (let [[xx yy] (peek stk)]
      (when (pos? (count stk))
        (if (and (zero? (aget (aget ary yy) xx)) (zero? (lvl xx yy)))
          (do (aset (aget ary yy) xx -1)
              (swap! found-atom inc)
              (recur (-> stk pop
                         (conj [(inc xx) yy])
                         (conj [(dec xx) yy])
                         (conj [xx (inc yy)])
                         (conj [xx (dec yy)]))))
          (recur (pop stk)))))))
