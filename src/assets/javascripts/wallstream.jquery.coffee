#= require_tree lib
#= require_tree vendors

(($) ->
  $.fn.extend wallStream: (options) ->
    @each ->
      $this = $(@)
      return $this if $this.data("wallstream")
      $this.data("wallstream", new WallStream($this, options))
      $this
)(jQuery)
