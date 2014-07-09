class WallStreamCore

  defaults =
    interval: 5000
    initialLimit: 10
    accessToken: null
    fields: []
    types: []
    host: "beta.walls.io"
    path: "/api/posts.json"
    onPost: ->

  constructor: (options) ->
    options = $.extend {}, defaults, options
    
    options.interval = Math.max(options.interval, 1000)

    latestId = null
    stopped  = true

    throw new Error("WallStreamCore: Access token missing") unless options.accessToken

    params =
      access_token: options.accessToken
      limit: options.initialLimit
      fields: options.fields
      types: options.types

    params.fields.push "id" if params.fields.indexOf("id") == -1 && params.fields.length > 0

    fetch = ->
      params.after = latestId if latestId

      $.getJSON "https://#{options.host}#{options.path}?callback=?&#{$.param(params)}", (result) =>
        return if stopped

        delete params.limit

        latestId = result?.data?[0].id if result?.data.length > 0
        options.onPost(post) for post in result?.data?.reverse()
        timeout = delayed(fetch, options.interval)

    delayed = (callback, ms, args...) ->
      setTimeout =>
        callback.apply(@, args)
      , ms
      
    @destroy = ->
      @stop()
      
    @start = ->
      if stopped
        stopped = false
        fetch()
      
      return @

    @stop = ->
      stopped = true
      if timeout
        clearTimeout timeout
        timeout = null
        
      return @
    
    @start()

window.WallStreamCore = WallStreamCore
