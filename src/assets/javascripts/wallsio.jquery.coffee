#= require prototype_extensions.coffee
#= require wall_error.coffee
#= require wall_stream.coffee
#= require wall.coffee

(($) ->
  $.fn.extend wall: (options) ->
    @each ->
      $this = $(@)
      return $this if $this.data("wall")
      $this.data("wall", new Wall($this, options))
      $this
)(jQuery)
