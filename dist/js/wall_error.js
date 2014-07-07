(function() {
  var WallError;

  WallError = (function() {
    function WallError(name, message) {
      throw {
        name: "" + name,
        level: "Show Stopper",
        message: "" + message,
        htmlMessage: "" + message,
        toString: function() {
          return "" + this.name + ": " + message;
        }
      };
    }

    return WallError;

  })();

  window.WallError = WallError;

}).call(this);
