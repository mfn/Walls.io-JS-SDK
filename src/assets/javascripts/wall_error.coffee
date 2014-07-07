class WallError
  constructor: (name, message) ->
    throw
      name: "#{name}"
      level: "Show Stopper"
      message: "#{message}"
      htmlMessage: "#{message}"
      toString: -> "#{@name}: #{message}"
        
window.WallError = WallError