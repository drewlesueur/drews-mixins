(function() {
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  $(document).ready(function() {
    var causesError, doesntCauseError, wait1, wait1Error, wait2, wait3;
    module("My mixins");
    wait2 = function(err, done) {
      return _.wait(200, function() {
        console.log("2 seconds");
        return done(2);
      });
    };
    wait3 = function(err, done) {
      return _.wait(300, function() {
        console.log("3 seconds");
        return done("3 seconds");
      });
    };
    wait1 = function(err, done) {
      return _.wait(100, function() {
        console.log("1 second");
        return done(1);
      });
    };
    wait1Error = function(err, done) {
      return _.wait(100, function() {
        console.log("error");
        return err("There was an error");
      });
    };
    causesError = function(func) {
      return _.wait(100, function() {
        return func("there was an error");
      });
    };
    doesntCauseError = function(func) {
      return _.wait(100, function() {
        return func(null, "success", "you did it");
      });
    };
    asyncTest("doThese", function() {
      return _.doThese([wait2, wait1, wait3], function(err, ret) {
        equal(err, null);
        equal(ret[0], 2);
        equal(ret[1], 1);
        equal(ret[2], "3 seconds");
        return start();
      });
    });
    asyncTest("doThese with object", function() {
      var todos;
      todos = {
        two: wait2,
        three: wait3,
        one: wait1
      };
      return _.doThese(todos, function(err, ret) {
        equal(err, null);
        equal(ret.two, 2);
        equal(ret.three, "3 seconds");
        equal(ret.one, 1);
        return start();
      });
    });
    asyncTest("doThese with error", function() {
      var todos;
      todos = {
        two: wait2,
        three: wait3,
        one: wait1Error
      };
      return _.doThese(todos, function(err, ret) {
        equal(err.one, "There was an error");
        equal(ret.two, 2);
        equal(ret.three, "3 seconds");
        equal((__indexOf.call(ret, 'one') < 0), true);
        return start();
      });
    });
    asyncTest("error helper with error ", function() {
      var err, errors, results;
      errors = [];
      results = [];
      err = function(error) {
        errors.push(error);
        equal(errors.length, 1);
        equal(errors[0], "there was an error");
        equal(results.length, 0);
        return start();
      };
      return causesError(_.errorHelper(err, function(result) {
        results.push(result);
        equal(true, false);
        return start();
      }));
    });
    asyncTest("error helper with error alternate", function() {
      var err, errors, results;
      errors = [];
      results = [];
      err = function(error) {
        errors.push(error);
        equal(errors.length, 1);
        equal(errors[0], "there was an error");
        equal(results.length, 0);
        return start();
      };
      return causesError(_.errorHelper(err)(function(result) {
        result.push(result);
        equal(true, false);
        return start();
      }));
    });
    asyncTest("error helper good ", function() {
      var err, errors, results;
      errors = [];
      results = [];
      err = function(error) {
        errors.push(error);
        equal(true, false);
        return start();
      };
      return doesntCauseError(_.errorHelper(err, function(result, result2) {
        results.push(result);
        equal(results.length, 1);
        equal(results[0], "success");
        equal(result2, "you did it");
        equal(errors.length, 0);
        return start();
      }));
    });
    return asyncTest("error helper good  alternate", function() {
      var err, errors, results;
      errors = [];
      results = [];
      err = function(error) {
        errors.push(error);
        equal(true, false);
        return start();
      };
      return doesntCauseError(_.errorHelper(err)(function(result, result2) {
        results.push(result);
        equal(results.length, 1);
        equal(results[0], "success");
        equal(result2, "you did it");
        equal(errors.length, 0);
        return start();
      }));
    });
  });
}).call(this);
