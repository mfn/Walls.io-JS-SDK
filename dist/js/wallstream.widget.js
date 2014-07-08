(function() {
  var WallStream, WallStreamCore, jQueryLoaded, loadjQuery,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
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
    WallStream.prototype.defaults = {
      template: '<p id="<%=id%>"><%=comment%></p>',
      maxPosts: 10,
      insertPosition: "before"
    };

    function WallStream(el, options) {
      if (options == null) {
        options = {};
      }
      this.renderPost = __bind(this.renderPost, this);
      this.$el = $(el);
      this.options = $.extend({}, this.defaults, options);
      this.stream = new WallStreamCore($.extend(this.options, {
        onPost: this.renderPost
      }));
    }

    WallStream.prototype.renderPost = function(post) {
      var $html, html, maxPosts, posts, sliceOptions, template;
      template = $.isFunction(this.options.template) ? this.options.template(post) : this.options.template;
      html = tmpl(template, post);
      this._callback(this.options.beforeInsert, html, post);
      if (this.options.insertPosition === "before") {
        this.$el.prepend($html = $(html));
      } else {
        this.$el.append($html = $(html));
      }
      if ((maxPosts = this.options.maxPosts) !== false) {
        sliceOptions = {
          after: [0, maxPosts * -1],
          before: [maxPosts]
        };
        posts = this.$el.children();
        posts.slice.apply(posts, sliceOptions[this.options.insertPosition]).remove();
      }
      return this._callback(this.options.afterInsert, $html, post);
    };

    WallStream.prototype._callback = function() {
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
    WallStreamCore.prototype.defaults = {
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
      this.options = {};
      this.options = $.extend({}, this.defaults, options);
      this.options.interval = Math.max(this.options.interval, 1000);
      this.latestId = null;
      this.stopped = false;
      if (!this.options.accessToken) {
        throw new Error("WallStreamCore: Access token missing");
      }
      this.params = {
        access_token: this.options.accessToken,
        limit: this.options.initialLimit,
        fields: this.options.fields,
        types: this.options.types
      };
      if (this.params.fields.indexOf("id") === -1 && this.params.fields.length > 0) {
        this.params.fields.push("id");
      }
      this._start();
    }

    WallStreamCore.prototype._prepareParams = function(params) {
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

    WallStreamCore.prototype._fetch = function() {
      if (this.latestId) {
        this.params.after = this.latestId;
      }
      return $.getJSON("https://" + this.options.host + this.options.path + "?callback=?&" + (this._prepareParams(this.params)), (function(_this) {
        return function(result) {
          var post, _i, _len, _ref, _ref1, _ref2;
          if (_this.stopped) {
            return;
          }
          delete _this.params.limit;
          if ((result != null ? result.data.length : void 0) > 0) {
            _this.latestId = result != null ? (_ref = result.data) != null ? _ref[0].id : void 0 : void 0;
          }
          _ref2 = result != null ? (_ref1 = result.data) != null ? _ref1.reverse() : void 0 : void 0;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            post = _ref2[_i];
            _this.options.onPost(post);
          }
          return _this._timeout = _this._delayed(_this._fetch, _this.options.interval);
        };
      })(this));
    };

    WallStreamCore.prototype._start = function() {
      this.stopped = false;
      return this._fetch();
    };

    WallStreamCore.prototype._stop = function() {
      this.stopped = true;
      if (this._timeout) {
        clearTimeout(this._timeout);
        return this._timeout = null;
      }
    };

    WallStreamCore.prototype._delayed = function() {
      var args, callback, ms;
      callback = arguments[0], ms = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return setTimeout((function(_this) {
        return function() {
          return callback.apply(_this, args);
        };
      })(this), ms);
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
