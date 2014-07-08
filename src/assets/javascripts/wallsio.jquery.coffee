#= require_tree lib
#= require_tree vendors

(($) ->
  $.fn.extend wall: (options) ->
    @each ->
      $this = $(@)
      return $this if $this.data("wall")
      $this.data("wall", new Wall($this, options))
      $this
)(jQuery)
