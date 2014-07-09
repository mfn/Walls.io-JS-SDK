(function() {
  var WallStream, WallStreamCore, jQueryLoaded, loadjQuery,
    __slice = [].slice;

  String.prototype.camelize = function() {
    return this.split(/-/).reduce(function(a, b) {
      if (/^\w+$/.test(b)) {
        return a + (a ? b[0].toUpperCase() : b[0]) + b.slice(1);
      } else {
        return a;
      }
    });
  };

  WallStream = (function() {
    var defaults;

    defaults = {
      template: '<p id="<%=id%>"><%=comment%></p>',
      maxPosts: 10,
      insertPosition: "before"
    };

    function WallStream(el, options) {
      var $el, callback, renderPost, stream;
      if (options == null) {
        options = {};
      }
      $el = $(el);
      options = $.extend({}, defaults, options);
      this.$el = $el;
      renderPost = function(post) {
        var $html, html, maxPosts, posts, sliceOptions, template;
        template = $.isFunction(options.template) ? options.template(post) : options.template;
        html = tmpl(template, post);
        callback(options.beforeInsert, html, post);
        if (options.insertPosition === "before") {
          $el.prepend($html = $(html));
        } else {
          $el.append($html = $(html));
        }
        if ((maxPosts = options.maxPosts) !== false) {
          sliceOptions = {
            after: [0, maxPosts * -1],
            before: [maxPosts]
          };
          posts = $el.children();
          posts.slice.apply(posts, sliceOptions[options.insertPosition]).remove();
        }
        return callback(options.afterInsert, $html, post);
      };
      callback = function() {
        var args, callback;
        callback = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if ($.isFunction(callback)) {
          return callback.apply(window, args);
        }
      };
      stream = new WallStreamCore($.extend(options, {
        onPost: renderPost
      }));
      this.stop = stream.stop;
      this.start = stream.start;
    }

    return WallStream;

  })();

  window.WallStream = WallStream;

  WallStreamCore = (function() {
    var defaults;

    defaults = {
      interval: 5000,
      initialLimit: 10,
      accessToken: null,
      fields: [],
      types: [],
      host: "beta.walls.io",
      path: "/api/posts.json",
      onPost: function() {}
    };

    function WallStreamCore(options) {
      var delayed, fetch, latestId, params, prepareParams, stopped;
      options = $.extend({}, defaults, options);
      options.interval = Math.max(options.interval, 1000);
      latestId = null;
      stopped = false;
      if (!options.accessToken) {
        throw new Error("WallStreamCore: Access token missing");
      }
      params = {
        access_token: options.accessToken,
        limit: options.initialLimit,
        fields: options.fields,
        types: options.types
      };
      if (params.fields.indexOf("id") === -1 && params.fields.length > 0) {
        params.fields.push("id");
      }
      prepareParams = function(params) {
        var key, newHash, value, valueIsArray;
        newHash = {};
        for (key in params) {
          value = params[key];
          valueIsArray = $.isArray(value);
          if (valueIsArray && value.length === 0) {
            continue;
          }
          if (!value) {
            continue;
          }
          newHash[key] = $.isArray(value) ? value.join(",") : value;
        }
        return $.param(newHash);
      };
      fetch = function() {
        if (latestId) {
          params.after = latestId;
        }
        return $.getJSON("https://" + options.host + options.path + "?callback=?&" + (prepareParams(params)), (function(_this) {
          return function(result) {
            var post, timeout, _i, _len, _ref, _ref1, _ref2;
            if (stopped) {
              return;
            }
            delete params.limit;
            if ((result != null ? result.data.length : void 0) > 0) {
              latestId = result != null ? (_ref = result.data) != null ? _ref[0].id : void 0 : void 0;
            }
            _ref2 = result != null ? (_ref1 = result.data) != null ? _ref1.reverse() : void 0 : void 0;
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              post = _ref2[_i];
              options.onPost(post);
            }
            return timeout = delayed(fetch, options.interval);
          };
        })(this));
      };
      delayed = function() {
        var args, callback, ms;
        callback = arguments[0], ms = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        return setTimeout((function(_this) {
          return function() {
            return callback.apply(_this, args);
          };
        })(this), ms);
      };
      this.start = function() {
        stopped = false;
        return fetch();
      };
      this.stop = function() {
        var timeout;
        stopped = true;
        if (timeout) {
          clearTimeout(timeout);
          return timeout = null;
        }
      };
      this.start();
    }

    return WallStreamCore;

  })();

  window.WallStreamCore = WallStreamCore;

  (function() {
    var cache, tmpl;
    cache = {};
    this.tmpl = tmpl = function(str, data) {
      var fn;
      fn = (!/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');"));
      if (data) {
        return fn(data);
      } else {
        return fn;
      }
    };
  })();

  jQueryLoaded = function() {
    var $widgetScriptTag;
    $widgetScriptTag = $("script:last");
    return $(function() {
      var $wallElement, attribute, options, _i, _len, _ref;
      $widgetScriptTag.after(($wallElement = $("<div class='wallstream'></div>")));
      options = {};
      _ref = $widgetScriptTag.get(0).attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attribute = _ref[_i];
        if (attribute.name.match(/^data-wallstream/)) {
          options[attribute.name.replace(/^data-wallstream/, "").camelize()] = $widgetScriptTag.data(attribute.name.replace(/^data-/, ""));
        }
      }
      return new WallStream($wallElement, options);
    });
  };

  loadjQuery = function() {
    var js;
    js = document.createElement("script");
    js.addEventListener("load", jQueryLoaded);
    js.src = "https://code.jquery.com/jquery-2.1.1.min.js";
    return document.head.appendChild(js);
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQueryLoaded();
  } else {
    loadjQuery();
  }

}).call(this);
