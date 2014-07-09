# Simple JavaScript Templating
# John Resig - http://ejohn.org/ - MIT Licensed
(->
  cache = {}
  window.WallStream.tmpl = tmpl = (str, data) ->

    # Figure out if we're getting a template, or if we need to
    # load the template - and be sure to cache the result.

    # Generate a reusable function that will serve as a template
    # generator (and which will be cached).

    # Introduce the data as local variables using with(){}

    # Convert the template into pure JavaScript
    fn = (if not /\W/.test(str) then cache[str] = cache[str] or tmpl(document.getElementById(str).innerHTML) else new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');"))

    # Provide some basic currying to the user
    (if data then fn(data) else fn)

  return
)()
