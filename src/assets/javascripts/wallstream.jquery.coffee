#= require_tree lib
#= require_tree vendors

(($) ->
  $.fn.extend wallStream: (options) ->
    @each ->
      $this = $(@)
      
      $this.on "wallstream.destroyed", -> $this.data("wallstream", null)
      
      if wallstream = $this.data("wallstream")
        wallstream.destroy()
      
      $this.data("wallstream", new WallStream($this, options))
      
      $this
)(jQuery)
