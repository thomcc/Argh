(defproject argh "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.4.0-beta3"]]
  :dev-dependencies [[lein-cljsbuild "0.1.6"]]
  :extra-classpath-dirs ["checkouts/clojurescript/src/clj"]
  :cljsbuild {:builds [{:source-path "src"
                        :compiler {:optimizations :whitespace
                                   :pretty-print true}}
                       #_{:source-path "src"
                        :compiler {:optimizations :advanced
                                   :output-to "mainadv.js"}}]})
