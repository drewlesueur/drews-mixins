var AssertionError, assert;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
AssertionError = (function() {
  __extends(AssertionError, Error);
  function AssertionError(options) {
    this.toString = __bind(this.toString, this);;    this.name = 'AssertionError';
    this.message = options.message;
    this.actual = options.actual;
    this.expected = options.expected;
    this.operator = options.operator;
  }
  AssertionError.prototype.toString = function() {
    if (this.message) {
      return [this.name + ':', this.message].join(' ');
    } else {
      return [this.name + ':', JSON.stringify(this.expected), this.operator, JSON.stringify(this.actual)].join(' ');
    }
  };
  return AssertionError;
})();
assert = {
  AssertionError: AssertionError,
  failCount: 0,
  passCount: 0,
  count: 0,
  fail: function(actual, expected, message, operator, stackStartFunction) {
    var e;
    this.failCount++;
    this.count++;
    e = {
      message: message,
      actual: actual,
      expected: expected,
      operator: operator,
      stackStartFunction: stackStartFunction
    };
    console.log(e);
    throw new assert.AssertionError(e);
  },
  pass: function(actual, expected, message, operator, stackStartFunction) {
    this.passCount++;
    return this.count++;
  },
  ok: function(value, message) {
    if (!!!value) {
      return assert.fail(value, true, message, '==', assert.ok);
    } else {
      return assert.pass(value, true, message, "==", assert.ok);
    }
  },
  equal: function(actual, expected, message) {
    if (actual != expected) {
      return assert.fail(actual, expected, message, '==', assert.equal);
    } else {
      return assert.pass(actual, expected, message, "==", assert.equal);
    }
  },
  notEqual: function(actual, expected, message) {
    if (actual == expected) {
      return assert.fail(actual, expected, message, '!=', assert.notEqual);
    } else {
      return assert.pass(actual, expected, message, '!=', assert.notEqual);
    }
  }
};