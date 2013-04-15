define(["jquery"], function(jQuery) {

  /**
   * Matchers for jQuery elements. All supports actual element to be a jQuery object
   * or string selector:
   *
   *     expect(boxElement).toExist();
   *     expect(".element").toExist();
   *
   * @class jasmine.domMatchers
   * @singleton
   * @type {Object}
   */
  var domMatchers = {

    /**
     * Check if actual element has passed class
     *
     *     expect(".element").toHaveClass(".box");
     *
     * @param {String} className
     * @return {Boolean}
     */
    toHaveClass: function(className) {
      return this.actual.hasClass(className);
    },

    /**
     * Check if actual element has passed css styles
     *
     *     expect(".element").toHaveCss({ border: "1px solid #333" });
     *
     * @param {Object} css
     * @return {Boolean}
     */
    toHaveCss: function(css) {
      for (var prop in css) {
        if (css.hasOwnProperty(prop) && this.actual.css(prop) !== css[prop]) {
          return false;
        }
      }
      return true;
    },

    /**
     * Check if actual element is visible
     *
     *     expect(".element").toBeVisible();
     *
     * @return {Boolean}
     */
    toBeVisible: function() {
      return this.actual.is(":visible");
    },

    /**
     * Check if actual element is hidden
     *
     *     expect(".element").toBeHidden();
     *
     * @return {Boolean}
     */
    toBeHidden: function() {
      return this.actual.is(":hidden");
    },

    /**
     * Check if actual element is selected
     *
     *     expect(".element").toBeSelected();
     *
     * @return {Boolean}
     */
    toBeSelected: function() {
      return this.actual.is(":selected");
    },

    /**
     * Check if actual element is checked
     *
     *     expect(".element").toBeChecked();
     *
     * @return {Boolean}
     */
    toBeChecked: function() {
      return this.actual.is(":checked");
    },

    /**
     * Check if actual element is empty
     *
     *     expect(".element").toBeEmpty();
     *
     * @return {Boolean}
     */
    toBeEmpty: function() {
      return this.actual.is(":empty");
    },

    /**
     * Check if actual element is disabled
     *
     *     expect(".element").toBeDisabled();
     *
     * @return {Boolean}
     */
    toBeDisabled: function() {
      return this.actual.is(":disabled");
    },

    /**
     * Check if actual element exists
     *
     *     expect(".element").toExist();
     *     expect(".element").toExist(2); // Check that exactly 2 elements exist
     *
     * @param {Number} [length] elements amount
     * @return {Boolean}
     */
    toExist: function(length) {
      var found = jQuery(this.actual);
      return length ? found.length == length : !!found.length;
    },

    /**
     * Check if actual element has attribute (using jQuery#attr)
     *
     *     expect(".element").toHaveAttr("type", "input");
     *
     * @param {String} name
     * @param {*} value
     * @return {Boolean}
     */
    toHaveAttr: function(name, value) {
      return hasProperty(this.actual.attr(name), value);
    },

    /**
     * Check if actual element has property (using jQuery#prop)
     *
     *     expect(".element").toHaveProp("checked", true);
     *
     * @param {String} name
     * @param {*} value
     * @return {Boolean}
     */
    toHaveProp: function(name, value) {
      return hasProperty(this.actual.prop(name), value);
    },

    /**
     * Check if actual element has passed html
     *
     *     expect(".element").toHaveHtml("<div>Hello</div>");
     *
     * @param {String} html
     * @return {Boolean}
     */
    toHaveHtml: function(html) {
      return this.actual.html() == browserTagCaseIndependentHtml(html);
    },

    /**
     * Check if actual element contains passed html
     *
     *     expect(".element").toContainHtml("<div>Hello</div>");
     *
     * @param {String} html
     * @return {Boolean}
     */
    toContainHtml: function(html) {
      var actualHtml = this.actual.html();
      var expectedHtml = browserTagCaseIndependentHtml(html);
      return (actualHtml.indexOf(expectedHtml) >= 0);
    },

    /**
     * Check if actual element has passed text
     *
     *     expect(".element").toHaveProp("Hello");
     *
     * @param {String} text
     * @return {Boolean}
     */
    toHaveText: function(text) {
      var trimmedText = this.actual.text().replace(/^\s+/, "").replace(/\s+$/, "");
      return trimmedText == text;
    },

    /**
     * Check if actual element contains passed text
     *
     *     expect(".element").toContainText("Hello");
     *
     * @param text
     * @return {Boolean}
     */
    toContainText: function(text) {
      var trimmedText = this.actual.text().replace(/^\s+/, "").replace(/\s+$/, "");
      return trimmedText.indexOf(text) >= 0;
    },

    /**
     * Check if actual element has passed value
     *
     *     expect(".element").toHaveValue("secret");
     *
     * @param {String} value
     * @return {Boolean}
     */
    toHaveValue: function(value) {
      return this.actual.val() == value;
    },

    /**
     * Check if actual element has passed data
     *
     *     expect(".element").toHaveData("type", "aria");
     *
     * @param {String} key
     * @param {*} value
     * @return {Boolean}
     */
    toHaveData: function(key, value) {
      return hasProperty(this.actual.data(key), value);
    },

    /**
     * Check if actual element matches passed selector
     *
     *     expect(".element").toMatchSelector(".box");
     *
     * @param {String} selector jQuery selector
     * @return {Boolean}
     */
    toMatchSelector: function(selector) {
      return this.actual.is(selector);
    },

    /**
     * Check if actual element contains passed jQuery selector
     *
     *     expect(".element").toContainSelector(".box");
     *
     * @param {String} selector
     * @return {Boolean}
     */
    toContainSelector: function(selector) {
      return this.actual.find(selector).length;
    }
  };

  var hasProperty = function(actualValue, expectedValue) {
    if (expectedValue === undefined) return actualValue !== undefined;
    return actualValue == expectedValue
  };

  var browserTagCaseIndependentHtml = function(html) {
    return jQuery("<div/>").append(html).html();
  };

  var elementToString = function(element) {
    return jQuery("<div/>").append(element.clone()).html() || element.selector;
  };

  var wrapMatcher = function(matcher) {
    return function() {
      this.actual = jQuery(this.actual);
      var result = matcher.apply(this, arguments);
      this.actual = elementToString(this.actual);
      return result;
    };
  };

  for (var key in domMatchers) {
    if (domMatchers.hasOwnProperty(key)) {
      domMatchers[key] = wrapMatcher(domMatchers[key]);
    }
  }

  jasmine.addMatchers(domMatchers);
});
