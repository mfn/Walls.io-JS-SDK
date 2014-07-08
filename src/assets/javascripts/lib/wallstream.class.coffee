class WallStream
  defaults:
    template: '<p id="<%=id%>"><%=comment%></p>'
    maxPosts: 10
    insertPosition: "before"

  constructor: (el, options = {}) ->
    @$el     = $(el)
    @options = $.extend {}, @defaults, options
    @stream  = new WallStreamCore $.extend(@options, { onPost: @renderPost })

  renderPost: (post) =>
    template = if $.isFunction(@options.template) then @options.template(post) else @options.template
    html     = tmpl(template, post)

    @_callback @options.beforeInsert, html, post

    if @options.insertPosition == "before"
      @$el.prepend($html = $(html))
    else
      @$el.append($html = $(html))

    if (maxPosts = @options.maxPosts) != false
      sliceOptions =
        after: [0, maxPosts * -1]
        before: [maxPosts]

      posts = @$el.children()
      posts.slice.apply(posts, sliceOptions[@options.insertPosition]).remove()

    @_callback @options.afterInsert, $html, post

  _callback: (callback, args...) ->
    if $.isFunction(callback)
      callback.apply(window, args)

window.WallStream = WallStream
