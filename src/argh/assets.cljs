(ns argh.assets
  (:require [waltz.state :as state])
  (:use [argh.core :only [page debug?]])
  (:use-macros [waltz.macros :only [in out defstate defevent]]))

(defn- create [type] (.createElement js/document (name type)))

(def pending (atom #{}))

(def asset-table (atom {}))

(defn loaded [name thing]
  (swap! asset-table assoc name thing)
  (swap! pending disj name)
  (when (empty? @pending)
    (state/trigger page :loaded)))

(defn image-loaded [name img]
  (let [cvs (create :canvas)
        w (.-width img)
        h (.-height img)]
    (set! (.-width cvs) w)
    (set! (.-height cvs) h)
    (let [ctx (.getContext cvs "2d")]
      (.drawImage ctx img 0 0 w h)
      (loaded name cvs))))

(defmulti load ; i hope eventually to have sound.  at least i'd rather
  (fn [_ item]  ; not rule it out.
    (condp re-matches item
      (js/RegExp. "(.*)\\.(png|gif|jpe?g)") :image
      :unknown)))

(defmethod load :default [name item]
  (when debug?
    (prn (str "Don't know how to load " name " from url " item))))

(defmethod load :image [name item]
  (let [img (create :img)]
    (set! img.src item)
    (set! img.onload #(image-loaded name img))))

(defn load-assets [assets]
  (doseq [[key asset] assets]
    (swap! pending conj key)
    (load key asset)))

(defn get-asset [name]
  (get @asset-table name))