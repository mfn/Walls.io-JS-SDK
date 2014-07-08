(function() {
  $(function() {
    return $("#mywall").wall({
      wallStreamOptions: {
        accessToken: "5f864451221b0e8d2ff61b3179ac1a3b5d4ac9e3"
      },
      template: $("#my-template").html(),
      beforeInsert: function(html, post) {
        if (/coffee/i.test(html)) {
          return false;
        }
        return html;
      },
      afterInsert: function($el) {
        console.log($el);
        return setTimeout(function() {
          return $el.css("background", "red");
        }, 2000);
      }
    });
  });

}).call(this);
