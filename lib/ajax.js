/**
 * Jasmine Ajax mock
 *
 * Modified Pivotal labs' helper (http://github.com/pivotal/jasmine-ajax)
 * with more flexible API
 *
 * @author Maksim Horbachevsky
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(window.jQuery);
  }
})(function($) {

  var extend = Object.extend || $.extend;

  function MockXhr() {
    extend(this, {
      requestHeaders: {},
      readyState: 0,
      status: null,
      responseText: null
    });

    return this;
  }

  extend(MockXhr.prototype, {
    send: function(data) {
      this.params = data;
      this.readyState = 2;
    },

    open: function() {
      this.method = arguments[0];
      this.url = arguments[1];
      this.username = arguments[3];
      this.password = arguments[4];
      this.readyState = 1;
    },

    setRequestHeader: function(header, value) {
      this.requestHeaders[header] = value;
    },

    abort: function() {
      this.readyState = 0;
    },

    onload: function() {
    },

    onreadystatechange: function(isTimeout) {
    },

    respond: function(response, options) {
      options = options || {};

      if (typeof response === 'string') {
        options.contentType = 'text/html';
      } else {
        options.contentType = 'application/json';
        response = JSON.stringify(response);
      }

      this.status = options.status || 200;
      this.responseText = response || '';
      this.readyState = 4;
      this.responseHeaders = options.responseHeaders || { 'Content-type': options.contentType };

      this.onload();
      this.onreadystatechange();
    },

    response: function() {
      this.respond.apply(this, arguments);
    },

    timeout: function() {
      this.readyState = 4;
      this.onreadystatechange('timeout');
    },

    data: function() {
      var data = {};

      if (typeof this.params === 'string') {
        try {
          data = JSON.parse(this.params);
        } catch(e) {
          var params = this.params.split('&');

          for (var i = 0; i < params.length; ++i) {
            var kv = params[i].replace(/\+/g, ' ').split('=');
            var key = decodeURIComponent(kv[0]);
            data[key] = data[key] || [];
            data[key].push(decodeURIComponent(kv[1]));
            data[key].sort();
          }
          return data;
        }
      }

      return data;
    },

    getResponseHeader: function(name) {
      return this.responseHeaders[name];
    },

    getAllResponseHeaders: function() {
      var responseHeaders = [];
      for (var i in this.responseHeaders) {
        if (this.responseHeaders.hasOwnProperty(i)) {
          responseHeaders.push(i + ': ' + this.responseHeaders[i]);
        }
      }
      return responseHeaders.join('\r\n');
    }
  });

  var Ajax = jasmine.Ajax = {

    calls: [],

    listeners: [],

    mostRecentCall: null,

    MockXhr: MockXhr,

    useMock: function() {
      if (!Ajax.installed) {
        Ajax.installed = true;
        Ajax._originalXhr = $.ajaxSettings.xhr;
        Ajax._originalFn = $.ajax;

        // Replace xhr generator
        $.ajaxSettings.xhr = Ajax.createMockXhr;

        // Replace original ajax fn to make additional call for listeners responder
        $.ajax = function(url, options) {
          var xhr = Ajax._originalFn.apply($, arguments);
          Ajax._respondToListeners();
          return xhr;
        };

        // Copy any static properties from original method into wrapped
        $.extend($.ajax, Ajax._originalFn);

        jasmine.getEnv().currentSpec.after(Ajax.uninstallMock);
      }
    },

    uninstallMock: function() {
      if (Ajax.installed) {
        $.ajaxSettings.xhr = Ajax._originalXhr;
        $.ajax = Ajax._originalFn;

        Ajax.installed = false;
        Ajax.reset();
      }
    },

    createMockXhr: function() {
      var xhr = new MockXhr();
      Ajax.calls.push(xhr);
      Ajax.mostRecentCall = xhr;
      return xhr;
    },

    reset: function() {
      Ajax.calls = [];
      Ajax.listeners = [];
      Ajax.mostRecentCall = null;
    },

    listen: function(matcher, response, options) {
      Ajax.listeners.unshift({ matcher: matcher, args: [].slice.call(arguments, 1) });
    },

    _respondToListeners: function() {
      var xhr = Ajax.mostRecentCall;

      $.each(Ajax.listeners, function(i, listener) {
        var args,
            match,
            url = xhr.url,
            matcher = listener.matcher;

        if (typeof matcher === 'string') {
          match = matcher === url && [url];
        } else {
          match = url.match(matcher);
        }

        if (match) {
          args = listener.args.slice();

          $.each(args, function(i) {
            if (typeof args[i] === 'function') {
              args[i] = args[i](xhr, match);
            }
          });

          xhr.respond.apply(xhr, args);
          return false;
        }
      });
    }
  };

  $.each(['respond', 'abort', 'timeout'], function(i, method) {
    Ajax[method] = function() {
      var mostRecentCall = Ajax.mostRecentCall;

      if (!Ajax.installed) {
        throw new Error('jasmine.Ajax is not installed. Use `jasmine.Ajax.useMock()` for it.');
      }

      if (!mostRecentCall) {
        throw new Error('Ajax is not called yet, so no most-recent-call reference available.');
      }

      mostRecentCall[method].apply(mostRecentCall, arguments);
    };
  });
});