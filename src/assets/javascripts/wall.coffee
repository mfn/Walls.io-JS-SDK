class Wall
  
  defaults:
    template: '<p id="#{id}">#{comment}</p>'
    wallStream: {}
  
  constructor: (el, options = {}) ->
    @$el     = $(el)
    @options = {}
    @options = $.extend {}, @defaults, options
    
    new WallError("AccessTokenError", "access token missing") unless @options.accessToken
    
    @stream = new WallStream
      onPost: @renderPost
    
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