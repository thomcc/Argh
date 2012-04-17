(defproject argh "0.0.3"
  :description "3D ClojureScript game."
  :dependencies [[org.clojure/clojure "1.4.0-beta3"]
                 [waltz "0.1.0-alpha1"]
                 [crate "0.1.0-alpha2"]]
  :dev-dependencies [[lein-cljsbuild "0.1.7"]]
  :extra-classpath-dirs ["checkouts/clojurescript/src/clj"]
  :cljsbuild {:builds {:dev {:source-path "src"
                             :compiler {:optimizations :whitespace
                                        :pretty-print true
                                        :output-to "pub/main.js"}}
                       :prod {:source-path "src"
                              :compiler {:optimizations :advanced
                                         :output-to "pub/mainadv.js"}}}})
