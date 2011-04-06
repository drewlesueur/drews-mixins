(function() {
  var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  (function() {
    var drewsMixins, _ref;
    drewsMixins = {
      doThese: function(todos, callback) {
        var doneCount, errors, length, makeDone, makeError, values;
        values = _.isArray(todos) ? [] : {};
        errors = _.clone(values);
        length = _.isArray(todos) ? todos.length : _.keys(todos).length;
        doneCount = 0;
        makeError = function(id) {
          return function(err) {
            doneCount += 1;
            errors[id] = err;
            if (doneCount === length) {
              return callback(errors, values);
            }
          };
        };
        makeDone = function(id) {
          return function(ret) {
            doneCount += 1;
            values[id] = ret;
            if (doneCount === length) {
              if (_.isEmpty(errors)) {
                errors = null;
              }
              return callback(errors, values);
            }
          };
        };
        return _.each(todos, function(todo, id) {
          return todo(makeError(id), makeDone(id));
        });
      },
      doTheseSync: function(todos, callback) {
        var doneCount, err, errors, length, next, values;
        values = _.isArray(todos) ? [] : {};
        errors = _.clone(values);
        length = _.isArray(todos) ? todos.length : _.keys(todos).length;
        doneCount = 0;
        err = function(ret) {
          errors[doneCount] = ret;
          doneCount += 1;
          if (doneCount === length) {
            return callback(errors, values);
          } else {
            return todos[doneCount](err, next);
          }
        };
        next = function(ret) {
          values[doneCount] = ret;
          doneCount += 1;
          if (doneCount === length) {
            if (_.isEmpty(errors)) {
              errors = null;
            }
            return callback(errors, values);
          } else {
            return todos[doneCount](err, next);
          }
        };
        return todos[0](err, next);
      },
      hanlde: function(errorFunc, callback) {
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
              return errorFunc.apply(null, [err].concat(__slice.call(extraArgs)));
            }
            return func.apply(null, results);
          };
        };
        if (callback) {
          return makeHandler(callback);
        } else {
          return makeHandler;
        }
      },
      s: function(val, start, end) {
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
      },
      startsWith: function(str, with_what) {
        return _.s(str, 0, with_what.length) === with_what;
      },
      rnd: function(low, high) {
        return Math.floor(Math.random() * (high - low + 1)) + low;
      },
      time: function() {
        return (new Date()).getTime();
      },
      replaceBetween: function(str, start, between, end) {
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
      },
      trimLeft: function(obj) {
        return obj.toString().replace(/^\s+/, "");
      },
      trimRight: function(obj) {
        return obj.toString().replace(/\s+$/, "");
      },
      isNumeric: function(str) {
        return _.s(str, 0, 1).match(/\d/);
      },
      capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
      },
      wait: function(miliseconds, func) {
        return setTimeout(func, miliseconds);
      },
      interval: function(miliseconds, func) {
        return setInterval(func, miliseconds);
      },
      compareArrays: function(left, right) {
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
      },
      pacManMapMaker: function(left, right, top, bottom) {
        return 1;
      }
    };
    if (module && module.exports) {
      module.exports = drewsMixins;
    }
    if (typeof _ != "undefined" && _ !== null) {
      if (typeof _.mixin == "function") {
        _.mixin(drewsMixins);
      }
    }
    return (_ref = root._) != null ? typeof _ref.mixin == "function" ? _ref.mixin(drewsMixins) : void 0 : void 0;
  })();
}).call(this);
