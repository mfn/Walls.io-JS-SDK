class WallFetcher

  defaults:
    interval: 2000
    initialLimit: 10
    accessToken: null
    fields: []
    types: []
    host: "https://beta.walls.io"
    path: "/api/posts.json"
    onPost: ->

  constructor: (options) ->
    @options = {}
    @options = $.extend {}, @defaults, options

    @latestId = null
    @stopped  = false

    new WallError("AccessTokenError", "access token missing") unless @options.accessToken

    @params =
      access_token: @options.accessToken
      limit: @options.initialLimit
      fields: @options.fields
      types: @options.types

    @params.fields.push "id" if @params.fields.indexOf("id") == -1 && @params.fields.length > 0

    @_start()

  _prepareParams: (params) ->
    newHash = {}
    for key, value of params

      valueIsArray = $.isArray(value)

      continue if valueIsArray && value.length == 0
      continue unless value

      newHash[key] = if $.isArray(value) then value.join(",") else value

    $.param(newHash)

  _fetch: ->
    @params.after = @latestId if @latestId

    $.getJSON "#{@options.host}#{@options.path}?callback=?&#{@_prepareParams(@params)}", (result) =>
      return if @stopped

      delete @params.limit

      @latestId = result?.data?[0].id if result?.data.length > 0
      @options.onPost(post) for post in result?.data?.reverse()
      @_timeout = @_delayed(@_fetch, @options.interval)

  _start: ->
    @stopped = false
    @_fetch()

  _stop: ->
    @stopped = true
    if @_timeout
      clearTimeout @_timeout
      @_timeout = null

  _delayed: (callback, ms, args...) ->
    setTimeout =>
      callback.apply(@, args)
    , ms

window.WallFetcher = WallFetcher
