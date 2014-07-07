(function() {
  var Wall,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Wall = (function() {
    Wall.prototype.defaults = {
      template: '<p id="#{id}">#{comment}</p>',
      wallStreamOptions: {}
    };

    function Wall(el, options) {
      if (options == null) {
        options = {};
      }
      this.renderPost = __bind(this.renderPost, this);
      this.$el = $(el);
      this.options = {};
      this.options = $.extend({}, this.defaults, options);
      this.stream = new WallStream($.extend(this.options.wallStreamOptions, {
        onPost: this.renderPost
      }));
    }

    Wall.prototype.renderPost = function(post) {
      var html, key, value;
      html = typeof this.options.template === "function" ? this.options.template(post) : this.options.template;
      for (key in post) {
        value = post[key];
        html = html.replace(new RegExp("\#\{" + key + "\}", "g"), value);
      }
      if (typeof this.options.beforeInsert === "function") {
        html = this.options.beforeInsert(html, post);
      }
      return this.$el.append(html);
    };

    return Wall;

  })();

  window.Wall = Wall;

}).call(this);
