(function() {
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  _.mixin({
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
    pacManMapMaker: function(left, right, top, bottom) {},
    doThese: function(todos, callback) {
      var makeJobsDone, returnValues;
      returnValues = _.isArray(todos) ? [] : {};
      makeJobsDone = function(id) {
        return function(ret) {
          var allDone;
          returnValues[id] = ret;
          allDone = true;
          _.each(todos, function(func, id) {
            if (!(id in returnValues)) {
              return allDone = false;
            }
          });
          if (allDone === true) {
            return callback(returnValues);
          }
        };
      };
      return _.each(todos, function(todo, id) {
        var jobsDone;
        jobsDone = makeJobsDone(id);
        return todo(jobsDone);
      });
    }
  });
}).call(this);
