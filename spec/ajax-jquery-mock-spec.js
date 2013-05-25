describe('MockXHR with jquery', function() {

  var Ajax = jasmine.Ajax,
      success,
      error,
      complete,
      xhr,
      request,
      response;

  function send(options) {
    options = $.extend({
      url: 'http://example.com/api',
      type: 'GET',
      success: success,
      error: error,
      complete: complete
    }, options);

    xhr = $.ajax(options);
    request = Ajax.mostRecentCall;
  }

  beforeEach(function() {
    Ajax.useMock();

    success = jasmine.createSpy('success');
    error = jasmine.createSpy('failure');
    complete = jasmine.createSpy('complete');
  });

  describe('when making a request', function() {
    beforeEach(function() {
      send();
    });

    it('stores URL and transport', function() {
      expect(request.url).toEqual('http://example.com/api');
    });

    it('push request to the queue', function() {
      expect(Ajax.calls.length).toEqual(1);
      expect(Ajax.calls[0]).toEqual(request);
    });

    it('does same with next request', function() {
      send();
      expect(Ajax.calls.length).toEqual(2);
      expect(Ajax.calls[1]).toEqual(request);
    });
  });

  describe('Ajax#reset', function() {
    beforeEach(function() {
      send();
      Ajax.reset();
    });

    it('clears calls cache', function() {
      expect(Ajax.calls.length).toEqual(0);
    });

    it('removes most recent call reference', function() {
      expect(Ajax.mostRecentCall).toBeFalsy();
    });
  });

  describe('Ajax#respond, #abort, #timeout', function() {
    $.each(['respond', 'abort', 'timeout'], function(i, method) {
      it('proxies ' + method + ' to the most recent call', function() {
        send();

        var spy = spyOn(request, method),
            args = { some: 'argument' };

        Ajax[method](args);
        expect(spy).toHaveBeenCalledWith(args);
      });
    });


    beforeEach(function() {
      send();
    });

    it('calls responds to the most recent call', function() {
      var spy = spyOn(Ajax.mostRecentCall, 'respond'),
          response = { success: true };

      Ajax.respond(response);
      expect(spy).toHaveBeenCalledWith(response);
    });
  });

  describe('Ajax#listen', function() {
    var respond;

    beforeEach(function() {
      respond = spyOn(Ajax.MockXhr.prototype, 'respond');
    });

    it('responds to matched url request', function() {
      Ajax.listen('/users/1', { name: 'Tom' });
      $.ajax('/users/1');
      $.ajax('/users/2');

      expect(respond.callCount).toEqual(1);
      expect(respond).toHaveBeenCalledWith({ name: 'Tom' });
    });

    it('responds to matched reg exp', function() {
      Ajax.listen(/^\/users\/\d{1}$/, { name: 'Tom' });
      $.ajax('/users/11');
      $.ajax('/users/1');

      expect(respond.callCount).toEqual(1);
      expect(respond).toHaveBeenCalledWith({ name: 'Tom' });
    });

    it('responds to matched reg exp and passes matching into response fn', function() {
      Ajax.listen(/^\/users\/(\d{1})$/, function(match) {
        return { name: 'Tom', id: match[1] };
      }, function() {
        return { status: 304 }
      });
      $.ajax('/users/1');

      expect(respond).toHaveBeenCalledWith({ name: 'Tom', id: '1' }, { status: 304 });
    });

    it('responds to matched url and passes it to response fn', function() {
      Ajax.listen('/users/1', function(match) {
        return { name: 'Tom', url: match[0] };
      }, function() {
        return { status: 304 };
      });
      $.ajax('/users/1');

      expect(respond).toHaveBeenCalledWith({ name: 'Tom', url: '/users/1' }, { status: 304 });
    });

    it('uses latest listener with higher priority', function() {
      Ajax.listen('/users/1', { name: 'Tom' });
      Ajax.listen('/users/1', { name: 'Sam' });
      $.ajax('/users/1');

      expect(respond).toHaveBeenCalledWith({ name: 'Sam' });
    });
  });

  describe('MockXHR#respond', function() {
    describe('with succeeded text/html response', function() {
      beforeEach(function() {
        send();
        request.respond('<div>OK</div>');
      });

      expectToSucceedWith({ status: 200, contentType: 'text/html', responseText: '<div>OK</div>' });
    });

    describe('with succeeded application/json response', function() {
      beforeEach(function() {
        send();
        request.respond({ result: 'OK' });
      });

      expectToSucceedWith({ status: 200, contentType: 'application/json', responseText: '{"result":"OK"}' });
    });

    describe('with failed response', function() {
      beforeEach(function() {
        send();
        request.respond('Woops', { status: 500 });
      });

      expectToFailWith({ status: 500, contentType: 'text/html', responseText: 'Woops' });
    });

    describe('with timeout response', function() {
      beforeEach(function() {
        send();
        request.timeout();
      });

      expectToFailWith({ status: null, contentType: null, responseText: null });
    });

    function expectToSucceedWith(context) {
      it('calls appropriate callbacks', function() {
        expect(success).toHaveBeenCalled();
        expect(complete).toHaveBeenCalled();
        expect(error).not.toHaveBeenCalled();
      });

      it('has the expected status code', function() {
        expect(xhr.status).toEqual(context.status);
      });

      it('has the expected content type', function() {
        expect(xhr.getResponseHeader('Content-type')).toEqual(context.contentType);
      });

      it('has the expected response text', function() {
        expect(xhr.responseText).toEqual(context.responseText);
      });
    }

    function expectToFailWith(context) {
      it('calls appropriate callbacks', function() {
        expect(success).not.toHaveBeenCalled();
        expect(complete).toHaveBeenCalled();
        expect(error).toHaveBeenCalled();
      });

      it('has the expected status code', function() {
        expect(xhr.status).toEqual(context.status);
      });

      it('has the expected content type', function() {
        expect(xhr.getResponseHeader('Content-type')).toEqual(context.contentType);
      });

      it('has the expected response text', function() {
        expect(xhr.responseText).toEqual(context.responseText);
      });
    }
  });

  describe('mocking', function() {
    beforeEach(function() {
      Ajax.uninstallMock();
    });

    it('replaces jQuery xhr with mocked', function() {
      Ajax.useMock();
      expect($.ajaxSettings.xhr).toEqual(Ajax.createMockXhr);
    });

    it('roll back original jQuery xhr when un-installed', function() {
      var original = $.ajaxSettings.xhr;

      Ajax.useMock();
      Ajax.uninstallMock();

      expect($.ajaxSettings.xhr).toEqual(original);
    });
  });
});