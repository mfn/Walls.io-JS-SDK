(function() {
  var Wall, WallError, WallStream,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  WallStream = (function() {
    function WallStream() {}

    return WallStream;

  })();

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

  Wall = (function() {
    Wall.prototype.defaults = {
      interval: 2000,
      initalLimit: 10,
      accessToken: null,
      template: '<p id="#{id}">#{comment}</p>',
      host: "https://beta.walls.io",
      beforeInsert: null
    };

    function Wall(el, options) {
      if (options == null) {
        options = {};
      }
      this.fetched = __bind(this.fetched, this);
      this.fetch = __bind(this.fetch, this);
      this.$el = $(el);
      this.options = {};
      this.options = $.extend({}, this.defaults, options);
      if (!this.options.accessToken) {
        new WallError("AccessTokenError", "access token missing");
      }
      this.latest = null;
      this.fetch();
    }

    Wall.prototype.fetch = function() {
      var params, path;
      params = {
        access_token: this.options.accessToken
      };
      if (!this.latest) {
        params["limit"] = this.options.initialLimit;
      }
      if (this.latest) {
        params["after"] = this.latest;
      }
      path = ("" + this.options.host + "/api/posts.json?callback=?&") + $.param(params);
      return $.getJSON(path, (function(_this) {
        return function(result) {
          if (result.data && result.data.length > 0) {
            _this.latest = result.data[0].id;
          }
          _this.fetched(result.data);
          return setTimeout(_this.fetch, _this.options.interval);
        };
      })(this));
    };

    Wall.prototype.fetched = function(posts) {
      var html, key, post, value, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = posts.length; _i < _len; _i++) {
        post = posts[_i];
        html = this.options.template;
        for (key in post) {
          value = post[key];
          html = html.replace(new RegExp("\#\{" + key + "\}", "g"), value);
        }
        if (typeof this.options.beforeInsert === "function") {
          html = this.options.beforeInsert(html, post);
        }
        if (html) {
          _results.push(this.$el.append(html));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Wall;

  })();

  window.Wall = Wall;

}).call(this);
