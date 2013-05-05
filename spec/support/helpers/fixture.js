(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(window.jQuery);
  }
})(function($) {

  var cache = {};

  var load = function(file) {
    var response = null;

    jQuery.ajax({
      url: file,
      async: false,
      success: function(data) {
        response = data;
      },
      error: function() {
        throw 'Failed load to fixture `' + file + '`. Make sure file exists and page is running under web-server.';
      }
    });

    return response;
  };

  /**
   * Loads fixture file from `support/fixtures/` path and parse it if needed (e.g. json). File content
   * will be loaded synchronously and cached so other calls will be retrieved from cache
   *
   *     var json = jasmine.fixture('user.json');
   *
   * @member jasmine
   * @param {String} file - fixture file to load
   * @return {Object|String}
   */
  jasmine.fixture = function(file) {
    if (file.indexOf('/') !== 0) {
      file = jasmine.fixture.path + file;
    }

    if (!cache[file]) {
      cache[file] = load(file);
    }

    return typeof cache[file] === 'object' ? $.extend(true, {}, cache[file]) : cache[file];
  };

  jasmine.fixture.path = '/base/spec/support/fixtures/';
});