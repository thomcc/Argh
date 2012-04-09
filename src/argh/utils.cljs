(ns argh.utils)


(defn add-attrs [elem attr-map]
  (doseq [[attr val] attr-map]
    (aset elem (name attr) val))
  elem)

(defn set-fill [ctx color] (set! ctx.fillStyle color))
(defn set-stroke [ctx stroke-style] (set! ctx.strokeStyle stroke-style))
(defn set-font [ctx font] (set! ctx.font font))


