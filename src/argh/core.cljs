(ns argh.core
  (:require [waltz.state :as state]))

(def screen (.getElementById js/document "screen"))
(def fps-elem (.getElementById js/document "fps"))
;(def map-canv (.getElementById js/document "map"))

(def page (state/machine :page))

(def view-width 160)
(def view-height 120)
(def scale 4)

(def ticks-per-sec 60)

(def screen-width (* view-width scale))
(def screen-height (* view-height scale))
(set! screen.width screen-width)
(set! screen.height screen-height)

(def assets {:wall "res/wallnew.png"
             :test "res/test.png"
             :test2 "res/testgrad.png"
             :floor "res/wallnew.png"})


(def debug? true)

(set! *print-fn* #(.log js/console %))
