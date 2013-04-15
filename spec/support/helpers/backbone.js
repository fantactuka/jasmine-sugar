define([], function() {
  'use strict';

  /**
   * Backbone history mock object to allow testing controllers coupled with routers
   * to check complex routing rules
   *
   * @example
   *
   *    some.router.js:
   *
   *      var SomeRouter = Backbone.Router.extend({
   *        routes: {
   *          'hello/:param': 'greet'
   *        },
   *
   *        greet: function(param) {
   *          ...
   *        }
   *      });
   *
   *    some.router.spec.js
   *
   *      describe('Some router', function() {
   *        var History = jasmine.Backbone.History;
   *
   *        beforeEach(function() {
   *          History.useMock();
   *        });
   *
   *        // Notice that router instantiated after creating spy. It's required
   *        // since backbone wraps actions into bound function and it's not available
   *        // from outside for mocking after instance is created.
   *        //
   *        // This should be fixed somehow in mocked history object
   *        it('runs greet action', function() {
   *          var spy = spyOn(SomeRouter.prototype, 'greet');
   *          new SomeRouter();
   *
   *          History.navigate('/hello/world');
   *          expect(spy).toHaveBeenCalled();
   *        });
   *      });
   *
   */

  var MockedLocation = function(href) {
    this.replace(href);
  };

  MockedLocation.prototype = {
    replace: function(href) {
      _.extend(this, _.pick($('<a></a>', {href: href})[0],
        'href',
        'hash',
        'host',
        'search',
        'fragment',
        'pathname',
        'protocol'
      ));

      // In IE, anchor.pathname does not contain a leading slash though
      // window.location.pathname does.
      if (!/^\//.test(this.pathname)) this.pathname = '/' + this.pathname;
    },

    toString: function() {
      return this.href;
    }
  };

  jasmine.Backbone = jasmine.Backbone || {};

  var History = jasmine.Backbone.History = {
    useMock: function() {
      var spec = jasmine.getEnv().currentSpec;
      spec.after(History._uninstall);
      History._install();
    },

    navigate: function(path) {
      if (!History._installed) {
        throw 'Use `jasmine.Backbone.History.useMock()` before doing fake navigation.';
      }

      History.location.replace('http://example.com#' + path);
      Backbone.history.checkUrl();
    },

    _install: function() {
      History.location = new MockedLocation('http://example.com');
      Backbone.history = _.extend(new Backbone.History(), { location: History.location });
      Backbone.history.interval = 9;
      Backbone.history.start({ pushState: false });
      History._installed = true;
    },

    _uninstall: function() {
      History._installed = false;
      History.location = null;
      Backbone.history.stop();
      Backbone.history = new Backbone.History();
    }
  };
});