(ns argh.render
  (:require [argh.canvas :as c])
  (:use [argh.assets :only [get-asset]])
  (:use-macros [argh.macros :only [for-loop]]))



(defn buff [size init]
  (let [b (js/Array. size)]
    (dotimes [i size]
      (aset b i init))
    b))

(defn render ; big ol' graphics code blob
  ;; todo: make less of a mess.
  [{{px :x py :y pz :z rot :rot wp :walkphase wk :walk :as player} :player
    lvl :level :as game-state} screen]
  (let [view-width screen.width
        view-height screen.height
        ctx (c/context screen)
        floor (.-data (c/data (get-asset :wall))) ; todo: art for floor
        idata (c/data screen); (.getImageData ctx 0 0 view-width view-height)
        pixels idata.data
        z-buff (buff (* view-width view-height) 10000)
        z-buff-wall (buff (* view-width view-height) 0)
        x-cam (- px (* (Math/cos rot) 0.3))
        y-cam (- py (* (Math/sin rot) 0.3))
        z-cam (- (* 0.01 wk (Math/sin (* wp 0.4))) pz 0.2)
        x-center (/ view-width 2)
        y-center (/ view-height 3)
        r-cos (Math/cos rot)
        r-sin (Math/sin rot)
        fov view-height
        r 6
        xcent (Math/floor x-cam)
        zcent (Math/floor y-cam)
        render-wall (fn [x0 y0 x1 y1])] ;; todo
    ;; render the walls
    (when false
      (for-loop [(zb (- zcent r)) (<= zb (+ zcent r)) (inc zb)]
        (for-loop [(xb (- xcent r)) (<= xb (+ xcent r)) (inc xb)]
          (if (pos? (lvl xb zb))
            (do (when-not (pos? (lvl (inc xb) zb))
                  (render-wall (inc xb) (inc zb) (inc xb) zb))
                (when-not (pos? (lvl xb (inc zb)))
                  (render-wall xb (inc zb) (inc xb) (inc zb))))
            (do (when (pos? (lvl (inc xb) zb))
                  (render-wall (inc xb) zb (inc xb) (inc zb)))
                (when (pos? (lvl xb (inc zb)))
                  (render-wall (inc xb) (inc zb) xb (inc zb))))))))
    ;; render the floor
    (dotimes [y view-height]
      (let [yd (/ (- (+ y 0.5) y-center) fov)
            ceil? (neg? yd)
            row (* y view-width)
            zd (if ceil? (/ (+ 4 (* 8 z-cam)) (- yd)) (/ (- 4 (* z-cam 8)) yd))]
       (dotimes [x view-width]
         (when (> (aget z-buff (+ x row)) zd)
           (let [xd (* zd (/ (- x-center x) fov))
                 xx (+ (* xd r-cos) (* zd r-sin) (* 8 (+ 0.5 x-cam)))
                 yy (+ (* zd r-cos) (* xd r-sin -1) (* 8 (+ 0.5 y-cam)))
                 xpix (* 2 xx)
                 ypix (* 2 yy)
                 xt (bit-shift-right xpix 4)
                 yt (bit-shift-right ypix 4)
                 ;;TODO:  block (lvl xt yt)
                 ;; (nth (data (min (dec w) (max 0 xt))) (min (dec
                 ;; h) (max 0 yt)))
                 ]
             (if false
               (aset (+ x row) z-buff -1)
               (let [pix-start (* 4 (+ x row))
                     tex-start (* 4 (+ (bit-and xpix 15)
                                       (* 16 (bit-and ypix 15))))]
                 (aset z-buff (+ x row) zd)
                 (aset pixels pix-start (aget floor tex-start))
                 (aset pixels (+ 1 pix-start) (aget floor (+ 1 tex-start)))
                 (aset pixels (+ 2 pix-start) (aget floor (+ 2 tex-start)))
                 (aset pixels (+ 3 pix-start) 255))))))))
    (dotimes [i (* view-width view-height)]
      (let [cl (aget z-buff i)]
        (when true ;(pos? cl)
          (let [xp (mod i view-width)
                yp (Math/floor (/ i view-width))
                xx (/ (- xp (/ view-width 2)) view-width)
                i4 (* i 4)
                r (aget pixels i4)
                g (aget pixels (+ 1 i4))
                b (aget pixels (+ 2 i4))
                dark (max 0 (min 255 (Math/floor (/ 60000 (* cl cl)))))]
            (aset pixels i4 (Math/floor (/ (* r dark) 255)))
            (aset pixels (+ 1 i4) (Math/floor (/ (* g dark) 255)))
            (aset pixels (+ 2 i4) (Math/floor (/ (* b dark) 255)))))))
    (.putImageData ctx idata 0 0)))

(defn draw-minimap
  [{{:keys [w h] :as lvl} :level {:keys [x y]} :player} cvs]
  (let [ctx (c/context cvs)
        scale (min (/ cvs.width w) (/ cvs.height h))]
    (c/clear cvs "white")
    (dotimes [j h]
      (dotimes [i w]
        (doto ctx
          (c/style (["white" "gray" "black"] (lvl i j)))
          (c/fill-rect (* i scale) (* j scale) scale scale))))
    (doto ctx
      (c/fill-style "green")
      (c/stroke-style "black")
      (c/fill-rect (- (* x scale) 2) (- (* y scale) 2) 4 4))))
