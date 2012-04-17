(ns argh.assets
  (:require [waltz.state :as state])
  (:use [argh.core :only [page debug?]])
  (:use-macros [waltz.macros :only [in out defstate defevent]]))

(defn- create [type] (.createElement js/document (name type)))

(def pending (atom #{}))

(def asset-table (atom {}))

(def done? (atom false))

(defn load-complete [name thing]
  (swap! asset-table assoc name thing)
  (swap! pending disj name)
  (when (empty? @pending)
    (reset! done? true)
    (state/trigger page :loaded)))

(defn give-up []
  (if-not @done?
    (do (when debug?
          (prn "couldn't load everything... gonna go for it regardless"))
        (reset! done? true)
        (swap! pending empty)
        (state/trigger page :loaded))
    (when debug? (prn "Assets loaded successfully"))))

(defmulti loaded (fn [kind & _] kind))

(defmethod loaded :default [kind name thing]
  (when debug?
    (prn (str "Don't know what to do with " kind ", " name "."))
    (pr thing)))

(defmethod loaded :image [_ name img]
  (let [cvs (create :canvas)
        w (.-width img)
        h (.-height img)]
    (set! (.-width cvs) w)
    (set! (.-height cvs) h)
    (let [ctx (.getContext cvs "2d")]
      (.drawImage ctx img 0 0 w h)
      (load-complete name cvs))))

;(derive ::moz-sound ::sound)
;(derive ::webkit-sound ::sound)


(defmethod loaded :sound [which name snd]
  (load-complete name #(do (set! snd.currentTime 0)
                           (.play snd))))
(defn asset-type [url]
  (condp re-matches url
    (js/RegExp. "(.*)\\.(png|gif|jpe?g)") :image
    (js/RegExp. "(.*)\\.wav") :sound
    :unknown))
(defmulti load (fn [_ item] (asset-type item)))

(defmethod load :default [name item]
  (when debug?
    (prn (str "Don't know how to load " name " from url " item))))

(defmethod load :image  [name item]
  (let [img (create :img)]
    (set! img.src item)
    (set! img.onload #(loaded :image name img))))

(defmethod load :sound [name item]
  (let [snd (js/Audio. item)]
    ;; eh it should at least work for chrome this way (usually).
    (loaded :sound name snd)))

(defmulti temp-asset asset-type)

(defmethod temp-asset :sound [_] (fn []))

(defmethod temp-asset :image [_]
  (let [c (create :canvas)]
    (set! c.width 16)
    (set! c.height 16)
    c))

(defn load-assets [assets]
  (doseq [[key asset] assets]
    (swap! asset-table assoc key (temp-asset asset))
    (swap! pending conj key)
    (load key asset))
  (js/setTimeout give-up 1000))

(defn get-asset [name]
  (get @asset-table name))