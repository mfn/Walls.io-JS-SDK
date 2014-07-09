(function() {
  var WallStream, WallStreamCore,
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
    var $el, callback, defaults, renderPost, settings;

    settings = null;

    $el = null;

    defaults = {
      template: '<p id="<%=id%>"><%=comment%></p>',
      maxPosts: 10,
      insertPosition: "before"
    };

    function WallStream(el, options) {
      var stream;
      if (options == null) {
        options = {};
      }
      settings = $.extend({}, defaults, options);
      stream = new WallStreamCore($.extend(settings, {
        onPost: renderPost
      }));
      $el = $(el);
      this.$el = $el;
      this.start = stream.start;
      this.stop = stream.stop;
    }

    renderPost = function(post) {
      var $html, html, maxPosts, posts, sliceOptions, template;
      template = $.isFunction(settings.template) ? settings.template(post) : settings.template;
      html = tmpl(template, post);
      callback(settings.beforeInsert, html, post);
      if (settings.insertPosition === "before") {
        $el.prepend($html = $(html));
      } else {
        $el.append($html = $(html));
      }
      if ((maxPosts = settings.maxPosts) !== false) {
        sliceOptions = {
          after: [0, maxPosts * -1],
          before: [maxPosts]
        };
        posts = $el.children();
        posts.slice.apply(posts, sliceOptions[settings.insertPosition]).remove();
      }
      return callback(settings.afterInsert, $html, post);
    };

    callback = function() {
      var args, callback;
      callback = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if ($.isFunction(callback)) {
        return callback.apply(window, args);
      }
    };

    return WallStream;

  })();

  window.WallStream = WallStream;

  WallStreamCore = (function() {
    var defaults, delayed, fetch, latestId, params, prepareParams, settings, stopped, timeout;

    latestId = null;

    stopped = false;

    settings = null;

    params = null;

    timeout = null;

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
      if (options == null) {
        options = {};
      }
      settings = $.extend({}, defaults, options);
      settings.interval = Math.max(settings.interval, 1000);
      if (!settings.accessToken) {
        throw new Error("WallStreamCore: Access token missing");
      }
      params = {
        access_token: settings.accessToken,
        limit: settings.initialLimit,
        fields: settings.fields,
        types: settings.types
      };
      if (params.fields.indexOf("id") === -1 && params.fields.length > 0) {
        params.fields.push("id");
      }
      this.start();
    }

    WallStreamCore.prototype.start = function() {
      stopped = false;
      return fetch();
    };

    WallStreamCore.prototype.stop = function() {
      stopped = true;
      if (timeout) {
        clearTimeout(timeout);
        return timeout = null;
      }
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
      return $.getJSON("https://" + settings.host + settings.path + "?callback=?&" + (prepareParams(params)), (function(_this) {
        return function(result) {
          var post, _i, _len, _ref, _ref1, _ref2;
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
            settings.onPost(post);
          }
          return timeout = delayed(fetch, settings.interval);
        };
      })(this));
    };

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

  (function($) {
    return $.fn.extend({
      wallStream: function(options) {
        return this.each(function() {
          var $this;
          $this = $(this);
          if ($this.data("wallstream")) {
            return $this;
          }
          $this.data("wallstream", new WallStream($this, options));
          return $this;
        });
      }
    });
  })(jQuery);

}).call(this);
