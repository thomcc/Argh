(ns argh.macros)


(defmacro with-path
  [c & forms]
  `(doto ~c
     (.beginPath)
     ~@forms
     (.closePath)))

(comment
 (defmacro doset
   [x & forms]
   (let [gx (gensym)]
     `(let [~gx ~x]
        ~@(map (fn [f]
                 (let [prop (symbol (str "-" (first f)))]
                   `(set! (. ~gx ~prop) (second f))))
               forms)
        ~gx))))

(comment
  (doset (.createElement js/document "div")
    (id "foo")
    (class "frob grovel quux")
    (width "500px"))
  )