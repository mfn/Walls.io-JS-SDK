#= require mototype.coffee
#= require wall.coffee

(($) ->
  $.fn.extend wall: (options) ->
    @each ->
      $this = $(@)
      return $this if $this.data("wall")
      $this.data("wall", new Wall($this, options))
      $this
)(jQuery)
