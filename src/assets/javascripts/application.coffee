$ ->

  $("#mywall").wall
    wallStreamOptions:
      accessToken: "5f864451221b0e8d2ff61b3179ac1a3b5d4ac9e3"
    template: $("#my-template").html()
    beforeInsert: (html, post) ->
      return false if /coffee/i.test(html)
      html
    afterInsert: ($el) ->
      console.log($el)
      setTimeout ->
        $el.css("background", "red")
      , 2000
