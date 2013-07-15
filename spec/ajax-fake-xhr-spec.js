describe('MockXHR', function() {
  var MockXhr = jasmine.Ajax.MockXhr,
      xhr;

  beforeEach(function() {
    xhr = new MockXhr();
  });

  it('should have an initial readyState of 0 (uninitialized)', function() {
    expect(xhr.readyState).toEqual(0);
  });

  describe('when opened', function() {
    beforeEach(function() {
      xhr.open('GET', 'http://example.com');
    });

    it('has a readyState of 1 (open)', function() {
      expect(xhr.readyState).toEqual(1);
    });

    describe('when sent', function() {
      it('has a readyState of 2 (sent)', function() {
        xhr.send(null);
        expect(xhr.readyState).toEqual(2);
      });
    });

    describe('when a response comes in', function() {
      it('has a readyState of 4 (loaded)', function() {
        xhr.response({status: 200});
        expect(xhr.readyState).toEqual(4);
      });
    });

    describe('when aborted', function() {
      it('has a readyState of 0 (uninitialized)', function() {
        xhr.abort();
        expect(xhr.readyState).toEqual(0);
      });
    });
  });

  describe('when opened with a username/password', function() {
    beforeEach(function() {
      xhr.open('GET', 'http://example.com', true, 'username', 'password');
    });

    it('stores the username', function() {
      expect(xhr.username).toEqual('username');
    });

    it('stores the password', function() {
      expect(xhr.password).toEqual('password');
    });
  });

  it('can be extended', function() {
    MockXhr.prototype.foo = function() {
      return 'foo';
    };

    expect(new MockXhr().foo()).toEqual('foo');
  });

  describe('data', function() {
    beforeEach(function() {
      xhr.open('POST', 'http://example.com?this=that');
    });

    it('returns request params as a hash of arrays with values sorted alphabetically', function() {
      xhr.send('3+stooges=shemp&3+stooges=larry%20%26%20moe%20%26%20curly&some%3Dthing=else+entirely');

      var data = xhr.data();
      expect(data['3 stooges'].length).toEqual(2);
      expect(data['3 stooges'][0]).toEqual('larry & moe & curly');
      expect(data['3 stooges'][1]).toEqual('shemp');
      expect(data['some=thing']).toEqual(['else entirely']);
    });

    it('returns parsed json', function() {
      var object = { a: 1, b: [1, 2] };
      xhr.send(JSON.stringify(object));

      expect(xhr.data()).toEqual(object);
    });
  });
});
