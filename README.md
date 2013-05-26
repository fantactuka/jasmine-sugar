jasmine-sugar [![Build Status](https://travis-ci.org/fantactuka/jasmine-sugar.png?branch=master)](https://travis-ci.org/fantactuka/jasmine-sugar)
=============

## Installation
Just grab needed helpers from lib dir

### Ajax
This helper allows you to mock and control ajax requests flow. It's extended Pivotal's helper with a little more flexible API

```js
describe('Twitter widget', function() {
  var Ajax = jasmine.Ajax, json;
  
  beforeEach(function() {
    Ajax.useMock();
    json = { data: [{ text: 'Hello', ...}, ...] };
  });
  
  it('shows twitter time-line', function() {
    Twitter.search();
    Ajax.respond(json);
    
    expect('.tweet').toExist();
  });

  it('shows error message if search failed', function() {
    Twitter.search();
    Ajax.respond({}, { status: 500 });

    expect('.error').toHaveText('Something went wrong');
  });
});
```

As you might noticed above you can use `Ajax.respond` (as well as `Ajax.timeout` and `Ajax.abort`) for the most
recent ajax request. It's the same as you do `Ajax.mostRecentCall.respond(json)`. As usually you can use specific
call in a stack via `Ajax.calls[3].respond(json)`. There's also alias `response` to `respond`.

#### Listening for future requests
Sometimes you might want to setup requests responses before running it. It's useful when u testing
one piece of functionality that should always resolve same request. It allows you to setup response
only once and later just write code in a synchronous manner
```js
describe('Twitter widget', function() {
  beforeEach(function() {
    // Exact url match
    Ajax.listen('/feed', { data: [...] });

    // RegExp match
    Ajax.listen(/^auth\/(\d*)/, function(match) {
      return { id: match[1] };
    });
  });

  it('authorizes user and renders menu', function() {
    Twitter.auth(1, 'secret');
    expect('.user-menu').toExist();
  });

  it('renders feed', function() {
    Twitter.fetch(); // E.g. it runs request to `/feed` which immediately resolved with { data: [...] }
    expect('.tweet').toExist();
  });

  it('renders counter', function() {
    Twitter.fetch();
    expect('.count').toExist();
  });
});
```
**Note** that newly added listeners have higher priority, so you can always override top level listeners
with more specific for nested specs.

### Fixture
Simple helper to load either html or json with cache support
```js
var json;

beforeEach(function() {
  json = jasmine.fixture('user.json');
  // Requests to '${jasmine.fixture.path}/user.json'
  // By default jasmine.fixture.path = '/base/spec/support/fixtures/' to work well with Karma (former testacular runner)
});
```

### Sandbox
Reference to html element that is cleared before each spec so you can use it to render needed html
```js
beforeEach(function() {
  var view = new View();
  view.render();
  view.$el.appendTo(jasmine.sandbox);
});
```

### Dom
A bunch of dom matchers that useful to check element attributes and properties in a various ways. It's tightly coupled with jQuery
