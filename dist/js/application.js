(function() {
  $(function() {
    return $("#mywall").wall({
      template: $("#myTemplate").html(),
      accessToken: "5f864451221b0e8d2ff61b3179ac1a3b5d4ac9e3",
      beforeInsert: function(html, post) {
        var _ref, _ref1;
        html = $(html);
        if ((_ref = post.comment) != null ? _ref.match(/instagram/i) : void 0) {
          html.css({
            background: "red"
          });
        }
        if ((_ref1 = post.comment) != null ? _ref1.match(/starbucks/i) : void 0) {
          return null;
        } else {
          return html.get(0).outerHTML;
        }
      }
    });
  });

}).call(this);
