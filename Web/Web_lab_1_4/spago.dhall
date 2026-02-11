{ name = "purescript-web-app"
, dependencies =
  [ "aff"
  , "argonaut"
  , "argonaut-core"
  , "arrays"
  , "console"
  , "effect"
  , "either"
  , "foldable-traversable"
  , "maybe"
  , "nullable"
  , "numbers"
  , "parallel"
  , "prelude"
  , "refs"
  , "strings"
  , "transformers"
  , "web-dom"
  , "web-events"
  , "web-html"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
