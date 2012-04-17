(ns argh.main
  (:require [waltz.state :as state]
            [argh.render :as screen]
            [argh.canvas :as c]
            [argh.view :as view])
  (:use [argh.assets :only [load-assets]]
        [argh.core :only [view-width view-height ticks-per-sec assets page
                          scale get-elem]]
        [argh.game :only [new-game tick]])
  (:use-macros [waltz.macros :only [defstate defevent in out]]))

(def input (atom #{}))
(def game (atom nil))

(def draw-cvs
  (let [dc (.createElement js/document "canvas")]
    (set! dc.width view-width)
    (set! dc.height view-height)
    dc))

(def scr-canv nil)
(def mini-canv nil)
(defn show-fps [fps]
  (set! (.-innerHTML (get-elem :fps))
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
      ;; (when-not (empty? @input)
      ;;   (when (zero? (mod current-tick 50))
      ;;     (when-let [step (.getElementById js/document "step")]
      ;;       (.play step))))
      (reset! last-tick (.getTime (js/Date.)))
      (c/clear draw-cvs "black")
      (c/animate game-loop)
      (screen/render @game draw-cvs)
      (screen/draw-ents @game mini-canv)
      (c/draw-on scr-canv draw-cvs))))

(def decode {27 :escape, 38 :up, 40 :down, 37 :left, 39 :right
             65 :strafel 68 :strafer, 87 :up, 83 :down})

(defn start-listening []
  (let [on-key #(fn [e]
                  (swap! input % (decode (.-keyCode e)))
                  (.preventDefault e))]
    (set! (.-onkeydown js/document) (on-key conj))
    (set! (.-onkeyup js/document) (on-key disj))))

(defn loading [txt]
  (c/clear scr-canv "black")
  (c/write-centered scr-canv txt))

(defn start-game []
  (set! mini-canv (get-elem :ent))
  (loading "Binding events...")
  (start-listening)
  (loading "Generating world...")
  (reset! game (new-game))
  (screen/draw-minimap @game (get-elem :map))
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
  (.appendChild document/body
                (view/layout (* view-width scale) (* view-height scale)))
  (set! scr-canv (get-elem :screen))
  (state/set page :loading))

(defevent page :loaded []
  (state/set page :playing))

(state/trigger page :init)
