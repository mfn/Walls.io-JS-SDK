String.prototype.camelize = ->
  @split(/-/).reduce (a, b) -> 
     if /^\w+$/.test(b) then a + (if a then b[0].toUpperCase() else b[0]) + b.slice(1) else a