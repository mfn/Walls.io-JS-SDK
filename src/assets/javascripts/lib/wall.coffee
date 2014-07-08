class Wall
  defaults:
    template: '<p id="<%=id%>"><%=comment%></p>'

  constructor: (el, options = {}) ->
    @$el     = $(el)
    @options = {}
    @options = $.extend {}, @defaults, options
    @stream  = new WallStream $.extend(@options, { onPost: @renderPost })

  renderPost: (post) =>
    template = if $.isFunction(@options.template) then @options.template(post) else @options.template
    html     = tmpl(template, post)

    @_callback @options.beforeInsert, html, post
    @$el.append($html = $(html))
    @_callback @options.afterInsert, $html, post
      
  _callback: (callback, args...) ->
    if $.isFunction(callback)
      callback.apply(window, args)

window.Wall = Wall