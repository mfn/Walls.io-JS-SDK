String.prototype.camelize = ->
  @split(/-/).reduce (a, b) -> 
     if /^\w+$/.test(b) then a + (if a then b[0].toUpperCase() else b[0]) + b.slice(1) else a

class Wall
  
  defaults:
    theme: null
    interval: 2000
    initalLimit: 10
    accessToken: null
    template: '<p id="#{id}">#{comment}</p>'
    host: "https://beta.walls.io"
  
  constructor: (el, options = {}) ->
    @$el     = $(el)
    @options = {}
    @options = $.extend {}, @defaults, options
    
    
    console.log options
    console.log @options
    
    @latest = null
  
    @fetch()
    
  fetch: =>
    
    params =
      access_token: @options.accessToken
        
    params["limit"] = @options.initialLimit unless @latest
    params["after"] = @latest if @latest
    
    path = "#{@options.host}/api/posts.json?callback=?&" + $.param(params)
    
    $.getJSON path, (result) =>
      
      @latest = result.data[0].id if result.data && result.data.length > 0
      
      @fetched result.data
      
      setTimeout @fetch, @options.interval
      
      
  fetched: (posts) ->
    for post in posts
      
      html = @options.template
      
      for key, value of post
        html = html.replace(new RegExp("\#\{#{key}\}", "g"), value)
        
      @$el.append html 
    


jQueryReady = ->
  $ ->
    $widgetScriptTag = $("script[src*='wall.js']")
    
    $widgetScriptTag.after ($wallElement = $("<div class='wall'></div>"))
    
    options = {}
    options[attribute.name.replace("data-option-", "").camelize()] = attribute.value for attribute in $widgetScriptTag.get(0).attributes when attribute.name.match(/^data-option-/)
    
    new Wall $wallElement, options
    

loadjQuery = ->
  js = document.createElement "script"
  js.addEventListener "load", jQueryReady
  js.src = "//code.jquery.com/jquery-2.1.1.min.js"
  document.head.appendChild js
  
if jQuery?
  jQueryReady()
else
  loadjQuery()