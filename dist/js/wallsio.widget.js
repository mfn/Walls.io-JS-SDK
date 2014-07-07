(function() {
  var jQueryLoaded, loadjQuery;

  jQueryLoaded = function() {
    var $widgetScriptTag;
    $widgetScriptTag = $("script:last");
    return $(function() {
      var $wallElement, attribute, options, _i, _len, _ref;
      $widgetScriptTag.after(($wallElement = $("<div class='wall'></div>")));
      options = {};
      _ref = $widgetScriptTag.get(0).attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attribute = _ref[_i];
        if (attribute.name.match(/^data-wall/)) {
          options[attribute.name.replace(/^data-wall/, "").camelize()] = attribute.value;
        }
      }
      return new Wall($wallElement, options);
    });
  };

  loadjQuery = function() {
    var js;
    js = document.createElement("script");
    js.addEventListener("load", jQueryLoaded);
    js.src = "//code.jquery.com/jquery-2.1.1.min.js";
    return document.head.appendChild(js);
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQueryLoaded();
  } else {
    loadjQuery();
  }

}).call(this);
