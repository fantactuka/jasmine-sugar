(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(window.jQuery);
  }
})(function($) {

  /**
   * Jasmine sandbox element that cleared before each test case
   *
   *     jasmine.sandbox.html("<div>Hello</div>");
   *
   * @member jasmine
   * @type {Object}
   * @property sandbox
   */
  jasmine.sandbox = $("<div id='jasmine-sandbox' />").appendTo("body");

  beforeEach(function() {
    jasmine.sandbox.empty();
  });
});
