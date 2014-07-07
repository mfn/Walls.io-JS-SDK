$ ->

  $("#mywall").wall
    template: $("#myTemplate").html()
    accessToken: "5f864451221b0e8d2ff61b3179ac1a3b5d4ac9e3"
    beforeInsert: (html, post) ->
      html = $(html)

      if post.comment?.match /instagram/i then html.css background: "red"
      if post.comment?.match /starbucks/i then null else html.get(0).outerHTML
