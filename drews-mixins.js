(function() {
  var AssertionError, count, drew, failCount, failedMessages, goAndDo, passCount, _;
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
  failedMessages = [];
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
    var addToObject, addToObjectMaker, createCommunicator, jsonHttpMaker, times;
    exports.asyncEx = function(len, cb) {
      return _.wait(len, function() {
        return cb(null, len);
      });
    };
    exports.asyncFail = function(len, cb) {
      return _.wait(len, function() {
        return cb(len);
      });
    };
    exports.doneMaker = function() {
      var allDone, allDoneCallback, done, doneLength, id, length, live, results;
      allDoneCallback = function() {};
      results = [];
      allDone = function(cb) {
        return allDoneCallback = cb;
      };
      id = _.uniqueId();
      length = 0;
      doneLength = 0;
      live = true;
      done = function() {
        var myLength;
        myLength = length;
        length++;
        return (function(myLength) {
          return function(err, result) {
            if (live === false) {
              return;
            }
            doneLength++;
            if (err) {
              allDoneCallback(err, results);
            }
            results[myLength] = result;
            if (doneLength === length) {
              allDoneCallback(null, results);
              return live = false;
            }
          };
        })(myLength);
      };
      return [done, allDone];
    };
    exports.on = function(obj, ev, callback) {
      var calls, list;
      calls = obj._callbacks || (obj._callbacks = {});
      list = calls[ev] || (calls[ev] = []);
      list.push(callback);
      obj._events = obj._callbacks;
      return obj;
    };
    exports.removeListener = function(obj, ev, callback) {
      var calls, i, item, list, _len;
      if (!ev) {
        obj._callbacks = {};
        obj._events = obj._callbacks;
      } else if (calls = obj._callbacks) {
        if (!callback) {
          calls[ev] = [];
        } else {
          list = calls[ev];
          if (!list) {
            return obj;
          }
          for (i = 0, _len = list.length; i < _len; i++) {
            item = list[i];
            if (callback === list[i]) {
              list.splice(i, 1);
              break;
            }
          }
        }
      }
      return obj;
    };
    exports.emit = function() {
      var args, both, callback, calls, ev, eventName, i, id, item, list, obj, _results;
      obj = arguments[0], eventName = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      console.log("you are emmitting " + eventName);
      console.log("and your calbacks are");
      console.log(obj._callbacks);
      both = 2;
      id = _.uniqueId();
      if (!(calls = obj._callbacks)) {
        return obj;
      }
      _results = [];
      while (both--) {
        ev = both ? eventName : "all";
        list = calls[ev];
        _results.push((function() {
          var _len, _results2;
          if (list = calls[ev]) {
            console.log("thie list is ");
            console.log(list);
            list = list.slice();
            _results2 = [];
            for (i = 0, _len = list.length; i < _len; i++) {
              item = list[i];
              console.log(i);
              console.log(list[i]);
              callback = list[i];
              _results2.push(!callback ? void 0 : (args = both ? args : args.unshift(eventName), callback.apply(obj, args)));
            }
            return _results2;
          }
        })());
      }
      return _results;
    };
    exports.trigger = exports.emit;
    exports.addListener = exports.on;
    exports.unbind = exports.removeListener;
    exports.once = function(obj, ev, callback) {
      var g;
      g = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        console.log("here are the old and new callbacks");
        console.log(obj._callbacks);
        _.removeListener(obj, ev, g);
        console.log(obj._callbacks);
        return callback.apply(obj, args);
      };
      return _.addListener(obj, ev, g);
    };
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
    times = function(numb, func) {
      var i, _results;
      _results = [];
      for (i = 1; 1 <= numb ? i <= numb : i >= numb; 1 <= numb ? i++ : i--) {
        _results.push(func(i));
      }
      return _results;
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
    createCommunicator = function(url) {
      var iframe, loaded;
      loaded = false;
      iframe = document.createElement("iframe");
      return $(iframe).load(function() {
        return loaded = true;
      });
    };
    addToObject = function(obj, key, value) {
      return obj[key] = value;
    };
    addToObjectMaker = function(obj) {
      return function(key, value) {
        return addToObject(obj, key, value);
      };
    };
    exports.addToObjectMaker = addToObjectMaker;
    jsonHttpMaker = function(method) {
      var http;
      return http = function() {
        var args, callback, contentType, data, url, _i, _ref;
        args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), callback = arguments[_i++];
        _ref = args, url = _ref[0], args = _ref[1], contentType = _ref[2];
        data = JSON.stringify(args || {});
        return $.ajax({
          url: "" + method,
          type: method || "POST",
          contentType: 'application/json' || contentType,
          data: data,
          dataType: 'json',
          processData: false,
          success: function(data) {
            return callback(null, data);
          },
          error: function(data) {
            return callback(JSON.parse(data.responseText));
          }
        });
      };
    };
    exports.jsonPost = jsonHttpMaker("POST");
    exports.jsonGet = jsonHttpMaker("GET");
    exports.jsonHttpMaker = jsonHttpMaker;
    /*    
    do ->
      giveBackTheCard = takeACard()
    
    
    
      giveBackTheCard()
      */
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
    exports.getFailedMessages = function() {
      return failedMessages;
    };
    exports.assertFail = function(actual, expected, message, operator, stackStartFunction) {
      var e;
      failCount++;
      count++;
      failedMessages.push(message);
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
