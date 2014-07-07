#= prototype_extensions.coffee
#= wall_error.coffee
#= wall_stream.coffee
#= wall.coffee

(($) ->
  $.fn.extend wall: (options) ->
    @each ->
      $this = $(@)
      return $this if $this.data("wall")
      $this.data("wall", new Wall($this, options))
      $this
)(jQuery)