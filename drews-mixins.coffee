drew = {}

failCount = 0
passCount = 0
count = 0

class AssertionError extends Error
  constructor: (options) ->
    @name = 'AssertionError'
    @message = options.message
    @actual = options.actual
    @expected = options.expected
    @operator = options.operator

  toString: () =>
    "test"
    [@name + ':', @message].join ' '

goAndDo = (exports, _) ->  
  exports.graceful = (errorFunc, callback) ->
    if _.isArray errorFunc
      extraArgs = _.s errorFunc, 1
      errorFunc = errorFunc[0]
    else
      extraArgs = []
    makeHandler = (func) ->
      (err, results...) ->
        if err
          #return errorFunc null, err, extraArgs...
          return errorFunc.apply null, null, null
        func results...
    if callback
      makeHandler callback
    else
      makeHandler
    

  #simple substring/slice functionality
  # for arrays and strings
  # very similar to php's subst and php's array_slice 
  exports.s = (val, start, end) ->
    need_to_join = false
    ret = []
    if _.isString val
      val = val.split ""
      need_to_join = true
    
    if start >= 0
    else
      start = val.length + start
    
    if _.isUndefined(end)
      ret = val.slice start
    else
      if end < 0
        end = val.length + end
      else
        end = end + start
      ret = val.slice start, end

    if need_to_join
      ret.join ""
    else
      ret

  exports.startsWith = (str, with_what) ->
    _.s(str, 0, with_what.length) == with_what
  
  exports.rnd = (low, high) -> Math.floor(Math.random() * (high-low+1)) + low

  exports.time = () ->
    (new Date()).getTime()

  exports.replaceBetween = (str, start, between, end) ->
    pos = str.indexOf start
    if pos is -1 then return str
    endpos = str.indexOf end, pos + start.length
    if endpos is -1 then return str
    return _.s(str, 0, pos + start.length) + between + _.s(str, endpos)
  exports.trimLeft = (obj) ->
    obj.toString().replace(/^\s+/, "")
  exports.trimRight = (obj) ->
    obj.toString().replace(/\s+$/, "")
  exports.isNumeric = (str) ->
    if _.isNumber(str)
      return true
    if _.s(str, 0, 1) == "-"
      return true
    if _.s(str, 0, 1).match(/\d/)
      return true
    else
      return false

  exports.capitalize = (str) ->
    str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

  # this is just a wrapper for setTimeout.
  # it puts the miliseconds first to it's more
  # natural to write in coffeescript

  exports.wait = (miliseconds, func) ->
    setTimeout func, miliseconds

  exports.interval = (miliseconds, func) ->
    setInterval func, miliseconds

  exports.compareArrays = (left, right) ->
    #not yet optimized
    inLeftNotRight = []
    inRightNotLeft = []
    inBoth = []
    for item in left
      if item in right
        inBoth.push item
      else
        inLeftNotRight.push item

    for item in right
      if item not in left
        inRightNotLeft.push item 

    return [inLeftNotRight, inRightNotLeft, inBoth]

  exports.pacManMapMaker = (left, right, top, bottom) ->
    1
    # todo make a little map maker 

  exports.populateArray = (obj, key, value) ->
    if not _.isArray obj[key]
      obj[key] = []
    obj[key].push value

  exports.getAssertCount = -> count
  exports.getFailCount = -> failCount
  exports.getPassCount =  -> passCount
    
  exports.assertFail = (actual, expected, message, operator, stackStartFunction) ->
    failCount++
    count++
    e = 
      message: message
      actual: actual
      expected: expected
      operator: operator
      stackStartFunction: stackStartFunction
    console.log e
    throw new AssertionError e
  exports.assertPass = (actual, expected, message, operator, stackStartFunction) ->
    passCount++
    count++
  exports.assertOk = (value, message) ->
    if !!!value
      _.assertFail value, true, message, '==', exports.assertOk
    else
      _.assertPass value, true, message, "==", _.assertOk
  exports.assertEqual = (actual, expected, message) ->
    if `actual != expected`
      _.assertFail actual, expected, message, '==', exports.assertEqual
    else
      _.assertPass actual, expected, message, "==", exports.assertEqual
  exports.assertNotEqual = (actual, expected, message) ->
    if `actual == expected`
      _.assertFail actual, expected, message, '!=', exports.assertNotEqual
    else
      _.assertPass actual, expected, message, '!=', exports.assertNotEqual


`
/**
 * Nimble
 * Copyright (c) 2011 Caolan McMahon
 *
 * Nimble is freely distributable under the MIT license.
 *
 * This source code is optimized for minification and gzip compression, not
 * readability. If you want reassurance, see the test suite.
 */

(function (exports) {

    var keys = Object.keys || function (obj) {
        var results = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                results.push(k);
            }
        }
        return results;
    };

    var fallback = function (name, fallback) {
        var nativeFn = Array.prototype[name];
        return function (obj, iterator, memo) {
            var fn = obj ? obj[name]: 0;
            return fn && fn === nativeFn ?
                fn.call(obj, iterator, memo):
                fallback(obj, iterator, memo);
        };
    };

    var eachSync = fallback('forEach', function (obj, iterator) {
        var isObj = obj instanceof Object;
        var arr = isObj ? keys(obj): (obj || []);
        for (var i = 0, len = arr.length; i < len; i++) {
            var k = isObj ? arr[i]: i;
            iterator(obj[k], k, obj);
        }
    });

    var eachParallel = function (obj, iterator, callback) {
        var len = obj.length || keys(obj).length;
        if (!len) {
            return callback();
        }
        var completed = 0;
        eachSync(obj, function () {
            var cb = function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    if (++completed === len) {
                        callback();
                    }
                }
            };
            var args = Array.prototype.slice.call(arguments);
            if (iterator.length) {
                var args = args.slice(0, iterator.length - 1);
                args[iterator.length - 1] = cb;
            }
            else {
                args.push(cb);
            };
            iterator.apply(this, args);
        });
    };

    var eachSeries = function (obj, iterator, callback) {
        var keys_list = keys(obj);
        if (!keys_list.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            var k = keys_list[completed];
            var args = [obj[k], k, obj].slice(0, iterator.length - 1);
            args[iterator.length - 1] = function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    if (++completed === keys_list.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            };
            iterator.apply(this, args);
        };
        iterate();
    };

    var mapSync = fallback('map', function (obj, iterator) {
        var results = [];
        eachSync(obj, function (v, k, obj) {
            results[results.length] = iterator(v, k, obj);
        });
        return results;
    });

    var mapAsync = function (eachfn) {
        return function (obj, iterator, callback) {
            var results = [];
            eachfn(obj, function (value, i, obj, callback) {
                var cb = function (err, v) {
                    results[results.length] = v;
                    callback(err);
                };
                var args = [value, i, obj];
                if (iterator.length) {
                    args = args.slice(0, iterator.length - 1);
                    args[iterator.length - 1] = cb;
                }
                else {
                    args.push(cb);
                }
                iterator.apply(this, args);
            }, function (err) {
                callback(err, results);
            });
        };
    };

    var filterSync = fallback('filter', function (obj, iterator, callback) {
        var results = [];
        eachSync(obj, function (v, k, obj) {
            if (iterator(v, k, obj)) {
                results[results.length] = v;
            }
        });
        return results;
    });

    var filterParallel = function (obj, iterator, callback) {
        var results = [];
        eachParallel(obj, function (value, k, obj, callback) {
            var cb = function (err, a) {
                if (a) {
                    results[results.length] = value;
                }
                callback(err);
            };
            var args = [value, k, obj];
            if (iterator.length) {
                args = args.slice(0, iterator.length - 1);
                args[iterator.length - 1] = cb;
            }
            else {
                args.push(cb);
            }
            iterator.apply(this, args);
        }, function (err) {
            callback(err, results);
        });
    };

    var reduceSync = fallback('reduce', function (obj, iterator, memo) {
        eachSync(obj, function (v, i, obj) {
            memo = iterator(memo, v, i, obj);
        });
        return memo;
    });

    var reduceSeries = function (obj, iterator, memo, callback) {
        eachSeries(obj, function (value, i, obj, callback) {
            var cb = function (err, v) {
                memo = v;
                callback(err);
            };
            var args = [memo, value, i, obj];
            if (iterator.length) {
                args = args.slice(0, iterator.length - 1);
                args[iterator.length - 1] = cb;
            }
            else {
                args.push(cb);
            }
            iterator.apply(this, args);
        }, function (err) {
            callback(err, memo);
        });
    };

    exports.each = function (obj, iterator, callback) {
        return (callback ? eachParallel: eachSync)(obj, iterator, callback);
    };
    exports.map = function (obj, iterator, callback) {
        return (callback ? mapAsync(eachParallel): mapSync)(obj, iterator, callback);
    };
    exports.filter = function (obj, iterator, callback) {
        return (callback ? filterParallel: filterSync)(obj, iterator, callback);
    };
    exports.reduce = function (obj, iterator, memo, callback) {
        return (callback ? reduceSeries: reduceSync)(obj, iterator, memo, callback);
    };

    exports.parallel = function (fns, callback) {
        var results = new fns.constructor();
        eachParallel(fns, function (fn, k, cb) {
            fn(function (err) {
                var v = Array.prototype.slice.call(arguments, 1);
                results[k] = v.length <= 1 ? v[0]: v;
                cb(err);
            });
        }, function (err) {
            (callback || function () {})(err, results);
        });
    };

    exports.series = function (fns, callback) {
        var results = new fns.constructor();
        var lastResult;
        eachSeries(fns, function (fn, k, cb) {
            var args = [function (err, result) {
                var v = Array.prototype.slice.call(arguments, 1);
                lastResult = results[k] = v.length <= 1 ? v[0]: v;
                cb(err);
            }];
            if (fn.length === 3) {
                args.unshift(lastResult, results);
            } else if (fn.length === 2) {
                args.unshift(lastResult);
            }
            fn.apply(null, args);
        }, function (err) {
            (callback || function () {})(err, results);
        });
    };

}(typeof exports === 'undefined' ? this._ = this._ || {}: drew));

`

if typeof exports  == 'undefined'
  _ = this._ || {}
  goAndDo drew, _
  _.mixin drew
else
  module.exports = (_) ->
    goAndDo drew, _
    _.mixin drew

#root._ if root._ is defined in parent script 
