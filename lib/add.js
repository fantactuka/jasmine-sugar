/**
 * Jasmine patch: add matchers collection into jasmine core. Using internal way to add matchers
 * outside of specs context (e.g. beforeEach) to speed up code execution
 * @member jasmine
 * @param {Object} matchers - matchers collection
 */
jasmine.addMatchers = function(matchers) {
  var parentClass = jasmine.getEnv().matchersClass;
  var matchersClass = function() {
    parentClass.apply(this, arguments);
  };

  jasmine.util.inherit(matchersClass, parentClass);
  jasmine.Matchers.wrapInto_(matchers, matchersClass);
  jasmine.getEnv().matchersClass = matchersClass;
};
