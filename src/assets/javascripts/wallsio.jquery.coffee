`
//= require ../../vendor/js/tmpl.js
`

#= require_tree includes

(($) ->
  $.fn.extend wall: (options) ->
    @each ->
      $this = $(@)
      return $this if $this.data("wall")
      $this.data("wall", new Wall($this, options))
      $this
)(jQuery)
