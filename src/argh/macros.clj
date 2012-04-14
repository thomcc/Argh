(ns argh.macros)
;; silly, but whatever.

(defmacro do-transform
  [c & forms]
  `(doto ~c
     (.save)
     ~@forms
     (.restore)))

(defmacro do-path
  [c & forms]
  `(doto ~c
     (.beginPath)
     ~@forms
     (.closePath)))

(defmacro with-transform
  [c & forms]
  `(let [c# ~c]
     (.save c#)
     ~@forms
     (.restore c#)))

(defmacro with-path
  [c & forms]
  `(let [c# ~c]
     (.beginPath c#)
     ~@forms
     (.closePath c#)))

(defmacro for-loop [[binding pred adv] & body]
  `(loop [~@binding]
     (when ~pred
       ~@body
       (recur ~adv))))
