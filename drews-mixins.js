(function() {
  var AssertionError, count, drew, failCount, goAndDo, passCount, _;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  drew = {};
  failCount = 0;
  passCount = 0;
  count = 0;
  AssertionError = (function() {
    __extends(AssertionError, Error);
    function AssertionError(options) {
      this.toString = __bind(this.toString, this);      this.name = 'AssertionError';
      this.message = options.message;
      this.actual = options.actual;
      this.expected = options.expected;
      this.operator = options.operator;
    }
    AssertionError.prototype.toString = function() {
      "test";      return [this.name + ':', this.message].join(' ');
    };
    return AssertionError;
  })();
  goAndDo = function(exports, _) {
    exports.graceful = function(errorFunc, callback) {
      var extraArgs, makeHandler;
      if (_.isArray(errorFunc)) {
        extraArgs = _.s(errorFunc, 1);
        errorFunc = errorFunc[0];
      } else {
        extraArgs = [];
      }
      makeHandler = function(func) {
        return function() {
          var err, results;
          err = arguments[0], results = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (err) {
            return errorFunc.apply(null, null, null);
          }
          return func.apply(null, results);
        };
      };
      if (callback) {
        return makeHandler(callback);
      } else {
        return makeHandler;
      }
    };
    exports.s = function(val, start, end) {
      var need_to_join, ret;
      need_to_join = false;
      ret = [];
      if (_.isString(val)) {
        val = val.split("");
        need_to_join = true;
      }
      if (start >= 0) {} else {
        start = val.length + start;
      }
      if (_.isUndefined(end)) {
        ret = val.slice(start);
      } else {
        if (end < 0) {
          end = val.length + end;
        } else {
          end = end + start;
        }
        ret = val.slice(start, end);
      }
      if (need_to_join) {
        return ret.join("");
      } else {
        return ret;
      }
    };
    exports.startsWith = function(str, with_what) {
      return _.s(str, 0, with_what.length) === with_what;
    };
    exports.rnd = function(low, high) {
      return Math.floor(Math.random() * (high - low + 1)) + low;
    };
    exports.time = function() {
      return (new Date()).getTime();
    };
    exports.replaceBetween = function(str, start, between, end) {
      var endpos, pos;
      pos = str.indexOf(start);
      if (pos === -1) {
        return str;
      }
      endpos = str.indexOf(end, pos + start.length);
      if (endpos === -1) {
        return str;
      }
      return _.s(str, 0, pos + start.length) + between + _.s(str, endpos);
    };
    exports.trimLeft = function(obj) {
      return obj.toString().replace(/^\s+/, "");
    };
    exports.trimRight = function(obj) {
      return obj.toString().replace(/\s+$/, "");
    };
    exports.isNumeric = function(str) {
      if (_.isNumber(str)) {
        return true;
      }
      if (_.s(str, 0, 1) === "-") {
        return true;
      }
      if (_.s(str, 0, 1).match(/\d/)) {
        return true;
      } else {
        return false;
      }
    };
    exports.capitalize = function(str) {
      return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
    };
    exports.wait = function(miliseconds, func) {
      return setTimeout(func, miliseconds);
    };
    exports.interval = function(miliseconds, func) {
      return setInterval(func, miliseconds);
    };
    exports.compareArrays = function(left, right) {
      var inBoth, inLeftNotRight, inRightNotLeft, item, _i, _j, _len, _len2;
      inLeftNotRight = [];
      inRightNotLeft = [];
      inBoth = [];
      for (_i = 0, _len = left.length; _i < _len; _i++) {
        item = left[_i];
        if (__indexOf.call(right, item) >= 0) {
          inBoth.push(item);
        } else {
          inLeftNotRight.push(item);
        }
      }
      for (_j = 0, _len2 = right.length; _j < _len2; _j++) {
        item = right[_j];
        if (__indexOf.call(left, item) < 0) {
          inRightNotLeft.push(item);
        }
      }
      return [inLeftNotRight, inRightNotLeft, inBoth];
    };
    exports.pacManMapMaker = function(left, right, top, bottom) {
      return 1;
    };
    exports.populateArray = function(obj, key, value) {
      if (!_.isArray(obj[key])) {
        obj[key] = [];
      }
      return obj[key].push(value);
    };
    exports.getAssertCount = function() {
      return count;
    };
    exports.getFailCount = function() {
      return failCount;
    };
    exports.getPassCount = function() {
      return passCount;
    };
    exports.setAssertCount = function(newCount) {
      return count = newCount;
    };
    exports.setPassCount = function(newCount) {
      return passCount = newCount;
    };
    exports.setFailCount = function(newCount) {
      return failCount = newCount;
    };
    exports.assertFail = function(actual, expected, message, operator, stackStartFunction) {
      var e;
      failCount++;
      count++;
      e = {
        message: message,
        actual: actual,
        expected: expected,
        operator: operator,
        stackStartFunction: stackStartFunction
      };
      return console.log(e);
    };
    exports.assertPass = function(actual, expected, message, operator, stackStartFunction) {
      passCount++;
      return count++;
    };
    exports.assertOk = function(value, message) {
      if (!!!value) {
        return _.assertFail(value, true, message, '==', exports.assertOk);
      } else {
        return _.assertPass(value, true, message, "==", _.assertOk);
      }
    };
    exports.assertEqual = function(actual, expected, message) {
      if (actual != expected) {
        return _.assertFail(actual, expected, message, '==', exports.assertEqual);
      } else {
        return _.assertPass(actual, expected, message, "==", exports.assertEqual);
      }
    };
    return exports.assertNotEqual = function(actual, expected, message) {
      if (actual == expected) {
        return _.assertFail(actual, expected, message, '!=', exports.assertNotEqual);
      } else {
        return _.assertPass(actual, expected, message, '!=', exports.assertNotEqual);
      }
    };
  };
  if (typeof exports === 'undefined') {
    _ = this._ || {};
    goAndDo(drew, _);
    _.mixin(drew);
  } else {
    module.exports = function(_) {
      goAndDo(drew, _);
      return _.mixin(drew);
    };
  }
}).call(this);
