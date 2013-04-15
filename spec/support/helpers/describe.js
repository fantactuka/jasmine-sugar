define([], function() {
  /**
   * Overriding Jasmine's describe to allow 3 arguments, where second is optional RequireJS dependencies list
   * @type {Function}
   */
  var original = window.describe;

  window.describe = function(description, dependencies, definition) {
    if (definition) {
      define(dependencies, function() {
        var args = arguments;

        original(description, function() {
          definition.apply(this, args);
        });
      });
    } else {
      original(description, dependencies)
    }
  };
});
