(ns argh.main
  (:require [waltz.state :as state]
            [argh.render :as screen]
            [argh.canvas :as c])
  (:use [argh.assets :only [load-assets]]
        [argh.core :only [view-width view-height ticks-per-sec assets page
                          screen map-canv fps-elem]]
        [argh.game :only [new-game tick]])
  (:use-macros [waltz.macros :only [defstate defevent in out]]))

(def input (atom #{}))
(def game (atom nil))

(def draw-cvs
  (let [dc (.createElement js/document "canvas")]
    (set! dc.width view-width)
    (set! dc.height view-height)
    dc))

(defn show-fps [fps]
  (set! (.-innerHTML fps-elem)
        (str (/ (Math/floor (* fps 100)) 100) " fps")))

(def last-tick (atom (.getTime (js/Date.))))

(defn game-loop []
  (when-not (:escape @input)
    (let [current-tick (.getTime (js/Date.))
          fps (/ 1000 (- current-tick @last-tick))
          needed (* (/ ticks-per-sec 1000) (- current-tick @last-tick))
          in @input]
      (show-fps fps)
      (swap! game #(loop [n needed, g %]
                     (if (< 0 n)
                       (recur (dec n) (tick g in))
                       g)))
      (reset! last-tick (.getTime (js/Date.)))
;      (screen/draw-minimap @game map-canv)
      (c/clear draw-cvs)
      (c/animate game-loop)
      (screen/render @game draw-cvs)
      (c/draw-on screen draw-cvs))))

(def decode {27 :escape, 38 :up, 40 :down, 37 :left, 39 :right
             65 :strafel 68 :strafer, 87 :up, 83 :down})

(defn start-listening []
  (let [on-key #(fn [e]
                  (swap! input % (decode (.-keyCode e)))
                  (.preventDefault e))]
    (set! (.-onkeydown js/document) (on-key conj))
    (set! (.-onkeyup js/document) (on-key disj))))

(defn loading [txt]
  (c/clear screen "black")
  (c/write-centered screen txt))

(defn start-game []
  (loading "Binding events...")
  (start-listening)
  (loading "Generating world...")
  (reset! game (new-game))
  (loading "Starting game loop!")
  (c/animate game-loop))


(defstate page :loading
  (in []
      (loading "Loading assets...")
      (load-assets assets)))

(defstate page :playing
  (in []
      (loading "Initializing game...")
      (start-game)))

(defevent page :init []
  (state/set page :loading))

(defevent page :loaded []
  (state/set page :playing))

(state/trigger page :init)
