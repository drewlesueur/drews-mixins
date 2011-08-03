(function() {
  var AssertionError, count, failCount, failedMessages, passCount;
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
    if (typeof define !== "undefined" && define !== null) {
    define;
  } else {
    define = function() {
      var args, name, ret, _i;
      args = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), name = arguments[_i++], ret = arguments[_i++];
      return typeof module !== "undefined" && module !== null ? module.exports = ret() : void 0;
    };
  };
  define("drews-mixins", function() {
    var addToObject, addToObjectMaker, errorHandleMaker, exports, hosty, jsonGet, jsonHttpMaker, jsonObj, jsonPost, jsonRpcMaker, log, meta, metaMaker, metaObjects, p, polymorphic, postMessageHelper, set, setLocation, times, trigger, _;
    _ = require("underscore");
    exports = {};
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
    exports.doneMaker2 = function() {
      var allDone, allDoneCallback, done, doneLength, hold, id, length, live;
      allDoneCallback = function() {};
      allDone = function(cb) {
        return allDoneCallback = cb;
      };
      id = _.uniqueId();
      length = 0;
      doneLength = 0;
      live = true;
      done = function(err) {
        if (live === false) {
          return;
        }
        doneLength++;
        if (err) {
          allDoneCallback(err);
        }
        if (doneLength === length) {
          allDoneCallback(null);
          return live = false;
        }
      };
      hold = function() {
        return length++;
      };
      return [hold, done, allDone];
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
    trigger = function() {
      var args, both, callback, calls, ev, eventName, i, id, item, list, obj, _results;
      obj = arguments[0], eventName = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
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
            list = list.slice();
            _results2 = [];
            for (i = 0, _len = list.length; i < _len; i++) {
              item = list[i];
              callback = list[i];
              _results2.push(!callback ? void 0 : (args = both ? args : args.unshift(eventName), callback.apply(obj, args)));
            }
            return _results2;
          }
        })());
      }
      return _results;
    };
    exports.trigger = trigger;
    exports.emit = exports.trigger;
    exports.addListener = exports.on;
    exports.unbind = exports.removeListener;
    exports.once = function(obj, ev, callback) {
      var g;
      g = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _.removeListener(obj, ev, g);
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
      var dupLeft, dupRight, inBoth, inLeftNotRight, inRightNotLeft, item, key, _i, _j, _len, _len2, _len3, _len4;
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
      dupLeft = [];
      dupRight = [];
      for (key = 0, _len3 = left.length; key < _len3; key++) {
        item = left[key];
        if ((__indexOf.call(_.s(left, 0, key - 1), item) >= 0) || (__indexOf.call(_.s(left, key + 1), item) >= 0)) {
          dupLeft[item] = "";
        }
      }
      for (key = 0, _len4 = right.length; key < _len4; key++) {
        item = right[key];
        if ((__indexOf.call(_.s(right, 0, key - 1), item) >= 0) || (__indexOf.call(_.s(right, key + 1), item) >= 0)) {
          dupRight[item] = "";
        }
      }
      dupLeft = _.keys(dupLeft);
      dupRight = _.keys(dupRight);
      return [inLeftNotRight, inRightNotLeft, inBoth, dupLeft, dupRight];
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
    setLocation = function(stuff, cb) {};
    log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return typeof console !== "undefined" && console !== null ? console.log.apply(console, args) : void 0;
    };
    exports.log = log;
    hosty = null;
    postMessageHelper = function(yourWin, origin, methods) {
      var callbacks, events, host, self;
      if (methods == null) {
        methods = {};
      }
      self = {};
      host = {};
      self.addMethods = function(fns) {
        return _.extend(methods, fns);
      };
      self.addMethods({
        bind: function(event, callback) {}
      });
      events = {};
      callbacks = {};
      self.trigger = function() {};
      self.write = function() {};
      self.trigger = function() {
        var event, params;
        event = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      };
      self.bind = function(event, callback) {
        var id, subscribe, subscribeString;
        id = _.uuid();
        subscribe = {
          channel: event,
          id: id
        };
        subscribeString = JSON.stringify(subscribe);
        events[event] || (events[event] = []);
        events[event].push(callback);
        return yourWin.postMessage(subscribeString, origin);
      };
      self.call = function() {
        var callback, id, method, params, request, requestString, _i;
        method = arguments[0], params = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), callback = arguments[_i++];
        id = _.uuid();
        request = {
          method: method,
          params: params,
          id: id
        };
        requestString = JSON.stringify(request);
        callbacks[id] = callback;
        return yourWin.postMessage(requestString, origin);
      };
      $(window).bind("message", function(e) {
        var error, id, message, method, params, result;
        e = e.originalEvent;
        if (e.origin !== origin && origin !== "*") {
          return;
        }
        message = JSON.parse(e.data);
        if ("result" in message) {
          id = message.id, error = message.error, result = message.result;
          return typeof callbacks[id] === "function" ? callbacks[id](error, result) : void 0;
        } else if ("method" in message) {
          method = message.method, params = message.params, id = message.id;
          return typeof methods[method] === "function" ? methods[method].apply(methods, __slice.call(params).concat([function(err, result) {
            var response, responseString;
            if (err == null) {
              err = null;
            }
            if (result == null) {
              result = null;
            }
            response = {
              error: err,
              result: result,
              id: id
            };
            responseString = JSON.stringify(response);
            return yourWin.postMessage(responseString, origin);
          }])) : void 0;
        }
      });
      return self;
    };
    exports.postMessageHelper = postMessageHelper;
    exports.uuid = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});;
    };
    errorHandleMaker = function(fns, handler) {
      var fn, ret, wasArray;
      ret = [];
      wasArray = true;
      if (!_.isArray(fns)) {
        fn = [fns];
        wasArray = false;
      }
      _.each(fns, function(fn) {
        return ret.push(function() {
          var args, cb, _i;
          args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
          return fn.apply(null, __slice.call(args).concat([function(err, result) {
            if (err) {
              handler(err, result);
            }
            return cb(err, result);
          }]));
        });
      });
      if (wasArray) {
        return ret;
      } else {
        return ret[0];
      }
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
          url: "" + url,
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
    jsonPost = jsonHttpMaker("POST");
    jsonGet = jsonHttpMaker("GET");
    jsonHttpMaker = jsonHttpMaker;
    /*
      # example node.js method for handling this rpc
      pg "/rpc", (req, res) ->
        body = req.body
        {method, params, id} = body
        log method, params, id
        log rpcMethods[method]
        rpcMethods[method] params..., (err, result) ->
          res.send
            result: result
            error: err
            id: id
      */
    jsonRpcMaker = function(url) {
      return function() {
        var args, callback, method, _i;
        method = arguments[0], args = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), callback = arguments[_i++];
        return jsonPost(url, {
          method: method,
          params: args,
          id: _.uuid()
        }, function(err, data) {
          var error, id, result;
          result = data.result, error = data.error, id = data.id;
          return typeof callback === "function" ? callback(error || err, result) : void 0;
        });
      };
    };
    metaObjects = {};
    meta = function(obj, defaulto) {
      var __mid;
      if (defaulto == null) {
        defaulto = {};
      }
      if (!(typeof obj === "object")) {
        return;
      }
      if ("__mid" in obj) {
        return metaObjects[obj.__mid];
      } else {
        __mid = _.uniqueId();
        obj.__mid = __mid;
        return metaObjects[__mid] = defaulto;
      }
    };
    set = function(obj, values) {
      _.each(values, function(value, key) {
        var changed, oldVal, oldVals;
        changed = {};
        oldVals = {};
        if (obj[key] !== value) {
          oldVal = obj[key];
          oldVals[key] = oldVal;
          obj[key] = value;
          changed[key] = value;
          return trigger(obj, "change:" + key, key, newVal, oldVal);
        }
      });
      if (changed.length > 0) {
        return trigger(obj, "change", changed, oldVals);
      }
    };
    metaMaker = function(val) {
      return function(obj, defaulto) {
        if (defaulto == null) {
          defaulto = {};
        }
        return (meta(obj))[val] || ((meta(obj))[val] = defaulto);
      };
    };
    polymorphic = function() {
      var args, member, obj, withMember;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      withMember = function(member, obj, chained) {
        var loopBack, ret, type;
        if (chained == null) {
          chained = false;
        }
        if (_.isFunction(member)) {
          ret = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return member.apply(null, [obj].concat(__slice.call(args)));
          };
        } else if ((typeof obj === "object") && member in obj) {
          ret = obj[member];
          if (_.isFunction(ret)) {
            ret = _.bind(ret, obj);
          }
        } else if ((typeof obj === "object") && "_lookup" in obj) {
          ret = obj._lookup(obj, member);
        }
        if (ret === p.cont) {} else {
          type = obj._type;
          if (type) {
            ret = polymorphic(type, member);
          } else if (member in _) {
            ret = function() {
              var args, _ref;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return (_ref = _(obj))[member].apply(_ref, args);
            };
          } else {
            ret = void 0;
          }
        }
        if (chained) {
          loopBack = function(member) {
            if (!member) {
              return ret;
            } else {
              return withMember(member, ret, true);
            }
          };
          if (_.isFunction(ret)) {
            return function() {
              var args;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              ret = ret.apply(null, args);
              return loopBack;
            };
          } else {
            return loopBack;
          }
        } else {
          return ret;
        }
      };
      obj = args[0], member = args[1];
      if (args.length === 1) {
        return function(member) {
          return withMember(member, obj, true);
        };
      } else {
        return withMember(member, obj, false);
      }
    };
    polymorphic.cont = "continue looking up";
    p = polymorphic;
    jsonObj = function(obj) {
      var jsonExclusions, ret;
      ret = {};
      jsonExclusions = (p(obj, "jsonExclusions")) || [];
      _.each(obj(function(value, key) {
        if (__indexOf.call(jsonExclusions, key) < 0) {
          if (typeof value === "object") {
            value = jsonObj(value);
          }
          return ret[key] = value;
        }
      }));
      return ret;
    };
    _.extend(exports, {
      jsonPost: jsonPost,
      jsonGet: jsonGet,
      jsonHttpMaker: jsonHttpMaker,
      jsonRpcMaker: jsonRpcMaker,
      meta: meta,
      set: set,
      metaMaker: metaMaker,
      polymorphic: polymorphic,
      jsonObj: jsonObj
    });
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
      return e = {
        message: message,
        actual: actual,
        expected: expected,
        operator: operator,
        stackStartFunction: stackStartFunction
      };
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
    exports.assertNotEqual = function(actual, expected, message) {
      if (actual == expected) {
        return _.assertFail(actual, expected, message, '!=', exports.assertNotEqual);
      } else {
        return _.assertPass(actual, expected, message, '!=', exports.assertNotEqual);
      }
    };
    exports.eachArray = function(arr, fn) {
      var k, v, _len;
      for (k = 0, _len = arr.length; k < _len; k++) {
        v = arr[k];
        fn(v, k);
      }
      return arr;
    };
    _.mixin(exports);
    return exports;
  });
}).call(this);
