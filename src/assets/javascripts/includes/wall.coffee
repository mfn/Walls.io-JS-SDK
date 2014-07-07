class Wall
  defaults:
    template: '<p id="#{id}">#{comment}</p>'
    wallStreamOptions: {}
  
  constructor: (el, options = {}) ->
    @$el     = $(el)
    @options = {}
    @options = $.extend {}, @defaults, options
    @stream  = new WallStream $.extend(@options.wallStreamOptions, { onPost: @renderPost })
      
  renderPost: (post) =>
    html = if typeof(@options.template) == "function" then @options.template(post) else @options.template
    html = html.replace(new RegExp("\#\{#{key}\}", "g"), value) for key, value of post  
    html = @options.beforeInsert(html, post) if typeof(@options.beforeInsert) == "function"
    @$el.append html
      
window.Wall = Wall