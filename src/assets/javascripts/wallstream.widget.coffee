#= require_tree lib
#= require_tree vendors


jQueryLoaded = ->

  $widgetScriptTag = $("script:last")

  $ ->

    $widgetScriptTag.after ($wallElement = $("<div class='wallstream'></div>"))

    options = {}
    for attribute in $widgetScriptTag.get(0).attributes
      if attribute.name.match /^data-wallstream/
        options[attribute.name.replace(/^data-wallstream/, "").camelize()] = $widgetScriptTag.data(attribute.name.replace(/^data-/, ""))

    new WallStream $wallElement, options


loadjQuery = ->
  js = document.createElement "script"
  js.addEventListener "load", jQueryLoaded
  js.src = "https://code.jquery.com/jquery-2.1.1.min.js"
  document.head.appendChild js

if jQuery?
  jQueryLoaded()
else
  loadjQuery()
