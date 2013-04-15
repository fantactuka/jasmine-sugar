define(["jquery"], function(jQuery) {

  /**
   * Jasmine sandbox element that cleared before each test case
   *
   *     jasmine.sandbox.html("<div>Hello</div>");
   *
   * @member jasmine
   * @type {Object}
   * @property sandbox
   */
  jasmine.sandbox = jQuery("<div id='jasmine-sandbox' />").appendTo("body");

  beforeEach(function() {
    jasmine.sandbox.empty();
  });
});
