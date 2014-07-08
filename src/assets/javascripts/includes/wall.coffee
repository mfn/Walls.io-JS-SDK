class Wall
  defaults:
    template: '<p id="<%=id%>"><%=comment%></p>'
    wallStreamOptions: {}

  constructor: (el, options = {}) ->
    @$el     = $(el)
    @options = {}
    @options = $.extend {}, @defaults, options
    @stream  = new WallStream $.extend(@options.wallStreamOptions, { onPost: @renderPost })

  renderPost: (post) =>
    template = if $.isFunction(@options.template) then @options.template(post) else @options.template

    html = tmpl(template, post)

    if $.isFunction(@options.beforeInsert)
      html = @options.beforeInsert(html, post)

    $html = $(html)
    @$el.append $html

    if $.isFunction(@options.afterInsert)
      @options.afterInsert($html)



window.Wall = Wall
