(ns argh.render
  (:require [argh.canvas :as c])
  (:use [argh.assets :only [get-asset]])
  (:use-macros [argh.macros :only [for-loop]]))

;; this file makes me wonder "why the fuck didn't i learn/use
;; webgl?"

;; alternatively, why am i not better at doing graphics functionally?

(defn- buff [size init]
  (let [b (js/Array. size)]
    (dotimes [i size]
      (aset b i init))
    b))

(defn- lerp [p t0 t1] (+ t0 (* p (- t1 t0))))
(defn render ;; todo: make less of a horryifying monolithic mess
  [{{px :x py :y pz :z rot :rot wp :walkphase wk :walk :as player} :player
    lvl :level :as game-state} screen]
  (let [view-width screen.width
        view-height screen.height
        ctx (c/context screen)
        floor (.-data (c/data (get-asset :floor))) ; todo: art for floor
        wall (.-data (c/data (get-asset :wall)))
        idata (.createImageData ctx view-width view-height)
        pixels idata.data
        z-buff (buff (* view-width view-height) 10000)
        z-buff-wall (buff view-width 0)
        x-cam (+ px #_(- (* (Math/cos rot) 0.3)))
        y-cam (+ py #_(- (* (Math/sin rot) 0.3)))
        z-cam (- (* 0.01 wk (Math/sin (* wp 0.4))) pz 0.2)
        x-center (/ view-width 2)
        y-center (/ view-height 3)
        r-cos (Math/cos rot), r-sin (Math/sin rot)
        xcent (Math/floor x-cam)
        zcent (Math/floor y-cam)
        render-wall
        (fn [x0 y0 x1 y1]
          (let [u (* 2 (- -0.5 z-cam)),              l (* 2 (- +0.5 z-cam))
                xc0 (* 2 (- x0 0.5 x-cam)),          yc0 (* 2 (- y0 0.5 y-cam))
                xc1 (* 2 (- x1 0.5 x-cam)),          yc1 (* 2 (- y1 0.5 y-cam))
                xx0 (- (* xc0 r-cos) (* yc0 r-sin)), zz0 (+ (* yc0 r-cos) (* xc0 r-sin))
                xx1 (- (* xc1 r-cos) (* yc1 r-sin)), zz1 (+ (* yc1 r-cos) (* xc1 r-sin))]
            (when-not (and (< zz0 0.2) (< zz1 0.2))
              (let [incr-0s? (< zz0 0.2), decr-1s? (< zz1 0.2)
                    p (/ (- 0.2 zz0) (- zz1 zz0))
                    xx0 (if incr-0s? (lerp p xx0 xx1) xx0)
                    xx1 (if decr-1s? (lerp p xx0 xx1) xx1)
                    zz0 (if incr-0s? (lerp p zz0 zz1) zz0)
                    zz1 (if decr-1s? (lerp p zz0 zz1) zz1)
                    xt0 (if incr-0s? (lerp p 0 16) 0)
                    xt1 (if decr-1s? (lerp p 0 16) 16)
                    x-pixel0 (- x-center (-> xx0 (/ zz0) (* view-height)))
                    x-pixel1 (- x-center (-> xx1 (/ zz1) (* view-height)))]
                (when (< x-pixel0 x-pixel1)
                  (let [xp0 (max 0 (Math/ceil x-pixel0))
                        xp1 (min view-width (Math/ceil x-pixel1))
                        y-pixel00 (-> u (/ zz0) (* view-height) (+ y-center))
                        y-pixel01 (-> l (/ zz0) (* view-height) (+ y-center))
                        y-pixel10 (-> u (/ zz1) (* view-height) (+ y-center))
                        y-pixel11 (-> l (/ zz1) (* view-height) (+ y-center))
                        iz0 (/ zz0)
                        iz1 (/ zz1)
                        iza (- iz1 iz0)
                        ixt0 (* xt0 iz0)
                        ixta (- (* xt1 iz1) ixt0)
                        iw (/ (- x-pixel1 x-pixel0))]
                    (for-loop [(x xp0) (< x xp1) (inc x)]
                      (let [pr (* iw (- x x-pixel0))
                            iz (+ iz0 (* iza pr))]
                        (when (<= (aget z-buff-wall x) iz)
                          (aset z-buff-wall x iz)
                          (let [x-tex (Math/floor (/ (+ ixt0 (* ixta pr)) iz))
                                y-pixel0 (- (lerp pr y-pixel00 y-pixel10) 0.5)
                                y-pixel1 (lerp pr y-pixel01 y-pixel11)
                                yp0 (max 0 (Math/ceil y-pixel0))
                                yp1 (min view-height (Math/ceil y-pixel1))
                                ih (/ (- y-pixel1 y-pixel0))]
                            (for-loop [(y yp0) (< y yp1) (inc y)]
                              (let [pry (* ih (- y y-pixel0))
                                    y-tex (Math/floor (* 16 pry))
                                    tst (* 4 (+ x-tex (* 16 y-tex)))
                                    pst (* 4 (+ x (* y view-width)))]
                                (aset z-buff (+ x (* y view-width)) (/ 4 iz))
                                (aset pixels pst (aget wall tst))
                                (aset pixels (+ 1 pst) (aget wall (+ 1 tst)))
                                (aset pixels (+ 2 pst) (aget wall (+ 2 tst)))
                                (aset pixels (+ 3 pst) 255)))))))))))))]
    (dotimes [i (* view-width view-height)] (aset pixels (+ 3 (* i 4)) 255))
    ;; render the walls
    (for-loop [(zb (- zcent 6)) (<= zb (+ zcent 6)) (inc zb)]
      (for-loop [(xb (- xcent 6)) (<= xb (+ xcent 6)) (inc xb)]
        (let [e (lvl (inc xb) zb), s (lvl xb (inc zb))]
          (if (pos? (lvl xb zb))
            (do (when-not (pos? e) (render-wall (inc xb) (inc zb) (inc xb) zb))
                (when-not (pos? s) (render-wall xb (inc zb) (inc xb) (inc zb))))
            (do (when (pos? e) (render-wall (inc xb) zb (inc xb) (inc zb)))
                (when (pos? s) (render-wall (inc xb) (inc zb) xb (inc zb))))))))
    ;; render the floor
    (dotimes [y view-height]
      (let [yd (/ (- (+ y 0.5) y-center) view-height)
            ceil? (neg? yd)
            row (* y view-width)
            zd (if ceil? (/ (+ 4 (* 8 z-cam)) (- yd)) (/ (- 4 (* z-cam 8)) yd))]
       (dotimes [x view-width]
         (when (> (aget z-buff (+ x row)) zd)
           (let [xd (* zd (/ (- x-center x) view-height))
                 xx (+ (* xd r-cos) (* zd r-sin) (* 8 (+ 0.5 x-cam)))
                 yy (+ (* zd r-cos) (* xd r-sin -1) (* 8 (+ 0.5 y-cam)))
                 xpix (* 2 xx)
                 ypix (* 2 yy)
                 xt (bit-shift-right xpix 4)
                 yt (bit-shift-right ypix 4)
                 block (lvl xt yt)]
             (if (pos? block)
               (aset (+ x row) z-buff -1)
               (let [pix-start (* 4 (+ x row))
                     tex-start (* 4 (+ (bit-and xpix 15) (* 16 (bit-and ypix 15))))]
                 (aset z-buff (+ x row) zd)
                 (aset pixels pix-start (aget floor tex-start))
                 (aset pixels (+ 1 pix-start) (aget floor (+ 1 tex-start)))
                 (aset pixels (+ 2 pix-start) (aget floor (+ 2 tex-start)))
                 (aset pixels (+ 3 pix-start) 255))))))))
    (dotimes [i (* view-width view-height)]
      (let [cl (aget z-buff i)]
        (when (pos? cl)
          (let [xp (mod i view-width)
                yp (* 14 (Math/floor (/ i view-width)))
                xx (/ (- xp (/ view-width 2)) view-width)
                i4 (* i 4)
                r (aget pixels i4)
                g (aget pixels (+ 1 i4))
                b (aget pixels (+ 2 i4))
                dark (Math/floor (- 300 (* cl 6 (inc (* xx xx 2)))))
                dark (bit-shift-left
                      (bit-shift-right
                       (+ dark (* 4 (bit-and (+ xp yp) 3))) 4) 4)
                dark (max 0 (min 255 (Math/floor dark)))
                ;; dark (max 0 (min 255 (Math/floor (/ 60000 (* cl cl)))))
                ]
            (aset pixels i4 (Math/floor (/ (* r dark) 255)))
            (aset pixels (+ 1 i4) (Math/floor (/ (* g dark) 255)))
            (aset pixels (+ 2 i4) (Math/floor (/ (* b dark) 255)))))))
    (.putImageData ctx idata 0 0)))
(defn draw-minimap [{{:keys [w h] :as lvl} :level} cvs]
  (let [ctx (c/context cvs), sc (/ cvs.width w)]
    (dotimes [j h]
      (dotimes [i w]
        (doto ctx
          (c/fill-style (["white" "gray" "black"] (lvl i j)))
          (c/fill-rect (* sc i) (* sc j) sc sc))))))
(defn draw-ents
  [{{px :x py :y} :player {w :w} :level} entcvs]
  (c/clear entcvs)
  (let [sc (/ entcvs.width w)]
    (doto (c/context entcvs)
      (c/fill-style "green")
      (c/fill-rect (* px sc) (* py sc) sc sc))))