class WallStream
  constructor: ->
    

class WallError
  constructor: (name, message) ->
    throw
      name:        "#{name}"
      level:       "Show Stopper"
      message:     "#{message}"
      htmlMessage: "#{message}"
      toString: ->
        "#{@name}: #{message}"

class Wall
  
  defaults:
    interval: 2000
    initalLimit: 10
    accessToken: null
    template: '<p id="#{id}">#{comment}</p>'
    host: "https://beta.walls.io"
    beforeInsert: null
  
  constructor: (el, options = {}) ->
    @$el     = $(el)
    @options = {}
    @options = $.extend {}, @defaults, options
    
    new WallError("AccessTokenError", "access token missing") unless @options.accessToken
    
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
      
      
  fetched: (posts) =>
    for post in posts
      
      html = @options.template
      
      for key, value of post
        html = html.replace(new RegExp("\#\{#{key}\}", "g"), value)
      
      html = @options.beforeInsert(html, post) if typeof(@options.beforeInsert) == "function"
      
      @$el.append html if html
      
window.Wall = Wall