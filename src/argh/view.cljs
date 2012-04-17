(ns argh.view
  (:require [crate.core :as crate])
  (:use-macros [crate.macros :only [defpartial]]))


(defpartial layout [w h]
  [:div#wrapper
   [:div#content
    [:h1 "Argh!"]
    [:div.clearfix
     [:canvas#screen {:width w, :height h}]
     [:div#status
      [:span#fps]
      [:div#minimap
       [:canvas#ent {:width 120, :height 120}]
       [:canvas#map {:width 120, :height 120}]]]]
    (about-text)]])

(defpartial about-text []
  [:div#about
   [:p "Control with arrow keys, strafing is possible with A and D. You can also
      halt the game with ESC."]
   [:p "This \"game\" was an experiment where I learn what would be necessary
       to make a game in ClojureScript, which is something I plan on doing for "
    [:a {:href "http://www.ludumdare.com/compo/"} "Ludum Dare 23"]
    " (a game competition), next weekend."]
   [:p "Source is "
    [:a {:href "https://github.com/thomcc/Argh"} "located on github"]
    ", but it's not really a pretty sight (especially the rendering code...)."]
   [:p "It should work best on chrome, but I've also been testing in Firefox."]])
