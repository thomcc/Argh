(ns argh.canvas
  (:use-macros [argh.macros :only [with-path do-path]]))
;; todo: consider clearing out no longer used
(defn fill-style [ctx color] (set! ctx.fillStyle color))
(defn stroke-style [ctx color] (set! ctx.strokeStyle color))
(defn set-font [ctx font] (set! ctx.font font))
(defn line-width [ctx wid] (set! ctx.lineWidth wid))
(defn fill-rect [ctx x y w h] (.fillRect ctx x y w h))
(defn clear-rect [ctx x y w h] (.clearRect ctx x y w h))
(defn move-to [ctx x y] (.moveTo ctx x y))
(defn line-to [ctx x y] (.lineTo ctx x y))
(defn stroke [ctx] (.stroke ctx))
(defn fill [ctx] (.fill ctx))
(defn style [ctx color]
  (doto ctx
    (fill-style color)
    (stroke-style color)))
(defn draw-on [cvs1 cvs2]
  (.. cvs1
      (getContext "2d")
      (drawImage cvs2 0 0 cvs1.width cvs1.height)))
(defn data [cvs]
  (.. cvs
      (getContext "2d")
      (getImageData 0 0 cvs.width cvs.height)))
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

(defn write-centered [cvs txt]
  (let [ctx (context cvs)]
    (doto ctx
      (fill-style "white")
      (set-font "30px sans-serif")
      (.fillText txt
                 (/ (- cvs.width (.. ctx (measureText txt) -width)) 2)
                 (/ cvs.height 2)))))

(def animate
  (or (.-requestAnimationFrame js/window)
      (.-webkitRequestAnimationFrame js/window)
      (.-mozRequestAnimationFrame js/window)
      (.-oRequestAnimationFrame js/window)
      (.-msRequestAnimationFrame js/window)
      (fn [callback] (js/setTimeout callback 17))))
