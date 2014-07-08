class WallStream
  defaults:
    template: '<p id="<%=id%>"><%=comment%></p>'
    maxPosts: 10

  constructor: (el, options = {}) ->
    @$el     = $(el)
    @options = $.extend {}, @defaults, options
    @stream  = new WallStreamCore $.extend(@options, { onPost: @renderPost })

  renderPost: (post) =>
    template = if $.isFunction(@options.template) then @options.template(post) else @options.template
    html     = tmpl(template, post)

    @_callback @options.beforeInsert, html, post
    @$el.prepend($html = $(html))

    if @options.maxPosts != false
      @$el.children().slice(@options.maxPosts).remove()

    @_callback @options.afterInsert, $html, post

  _callback: (callback, args...) ->
    if $.isFunction(callback)
      callback.apply(window, args)

window.WallStream = WallStream
