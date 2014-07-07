$ ->
  
  $("#mywall").wall
    wallStreamOptions:
      accessToken: "5f864451221b0e8d2ff61b3179ac1a3b5d4ac9e3"
    beforeInsert: (html, post) ->
      html