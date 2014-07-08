(function() {
  var Wall, WallError, WallStream,
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

  Wall = (function() {
    Wall.prototype.defaults = {
      template: '<p id="<%=id%>"><%=comment%></p>'
    };

    function Wall(el, options) {
      if (options == null) {
        options = {};
      }
      this.renderPost = __bind(this.renderPost, this);
      this.$el = $(el);
      this.options = {};
      this.options = $.extend({}, this.defaults, options);
      this.stream = new WallStream($.extend(this.options, {
        onPost: this.renderPost
      }));
    }

    Wall.prototype.renderPost = function(post) {
      var $html, html, template;
      template = $.isFunction(this.options.template) ? this.options.template(post) : this.options.template;
      html = tmpl(template, post);
      this._callback(this.options.beforeInsert, html, post);
      this.$el.append($html = $(html));
      return this._callback(this.options.afterInsert, $html, post);
    };

    Wall.prototype._callback = function() {
      var args, callback;
      callback = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if ($.isFunction(callback)) {
        return callback.apply(window, args);
      }
    };

    return Wall;

  })();

  window.Wall = Wall;

  WallError = (function() {
    function WallError(name, message) {
      throw {
        name: "" + name,
        level: "Show Stopper",
        message: "" + message,
        htmlMessage: "" + message,
        toString: function() {
          return "" + this.name + ": " + message;
        }
      };
    }

    return WallError;

  })();

  window.WallError = WallError;

  WallStream = (function() {
    WallStream.prototype.defaults = {
      interval: 2000,
      initialLimit: 10,
      accessToken: null,
      fields: [],
      types: [],
      host: "https://beta.walls.io",
      path: "/api/posts.json",
      onPost: function() {}
    };

    function WallStream(options) {
      this.options = {};
      this.options = $.extend({}, this.defaults, options);
      this.latestId = null;
      this.stopped = false;
      if (!this.options.accessToken) {
        new WallError("AccessTokenError", "access token missing");
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

    WallStream.prototype._prepareParams = function(params) {
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

    WallStream.prototype._fetch = function() {
      if (this.latestId) {
        this.params.after = this.latestId;
      }
      return $.getJSON("" + this.options.host + this.options.path + "?callback=?&" + (this._prepareParams(this.params)), (function(_this) {
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

    WallStream.prototype._start = function() {
      this.stopped = false;
      return this._fetch();
    };

    WallStream.prototype._stop = function() {
      this.stopped = true;
      if (this._timeout) {
        clearTimeout(this._timeout);
        return this._timeout = null;
      }
    };

    WallStream.prototype._delayed = function() {
      var args, callback, ms;
      callback = arguments[0], ms = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return setTimeout((function(_this) {
        return function() {
          return callback.apply(_this, args);
        };
      })(this), ms);
    };

    return WallStream;

  })();

  window.WallStream = WallStream;

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
      wall: function(options) {
        return this.each(function() {
          var $this;
          $this = $(this);
          if ($this.data("wall")) {
            return $this;
          }
          $this.data("wall", new Wall($this, options));
          return $this;
        });
      }
    });
  })(jQuery);

}).call(this);
