#= require prototype_extensions.coffee
#= require wall_error.coffee
#= require wall_stream.coffee
#= require wall.coffee

jQueryLoaded = ->
  
  $widgetScriptTag = $("script:last")
  
  $ ->
    
    $widgetScriptTag.after ($wallElement = $("<div class='wall'></div>"))
    
    options = {}
    for attribute in $widgetScriptTag.get(0).attributes
      if attribute.name.match /^data-wall/
        options[attribute.name.replace(/^data-wall/, "").camelize()] = attribute.value
      
    new Wall $wallElement, options
    

loadjQuery = ->
  js = document.createElement "script"
  js.addEventListener "load", jQueryLoaded
  js.src = "//code.jquery.com/jquery-2.1.1.min.js"
  document.head.appendChild js

if jQuery?
  jQueryLoaded()
else
  loadjQuery()