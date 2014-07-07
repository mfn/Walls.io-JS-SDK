class WallStream
  
  defaults:
    interval: 2000
    initalLimit: 10
    accessToken: null
    host: "https://beta.walls.io"
    path: "/api/feed"
    onPost: null
    filter: null
  
  constructor: (options) ->
    @options = {}
    @options = $.extend {}, @defaults, options
    
    @params = 
      access_token: @options.accessToken
      limit: @options.initialLimit
    
    @_start()
    
  _fetch: ->
    $.getJSON "#{@options.host}/api/", (result) ->
      
    
  _start: ->
    
    
  _stop: ->
    alert 1
    
    
    
window.WallStream = WallStream