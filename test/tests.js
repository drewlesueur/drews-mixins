var acceptableOff, causesError, doesntCauseError, wait1, wait1Error, wait2, wait3;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
}, __slice = Array.prototype.slice;
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
acceptableOff = 40;
asyncTest("doThese", function() {
  var startTime;
  startTime = _.time();
  return _.doThese([wait2, wait1, wait3], function(err, ret) {
    var diff;
    equal(err, null);
    equal(ret[0], 2);
    equal(ret[1], 1);
    equal(ret[2], "3 seconds");
    diff = _.time() - startTime - 300;
    equal(diff > -acceptableOff, true);
    equal(diff < acceptableOff, true, "within " + diff + " off");
    return start();
  });
});
asyncTest("doTheseSync", function() {
  var startTime, todos;
  todos = [wait1, wait2, wait3];
  startTime = _.time();
  return _.doTheseSync(todos, function(errors, values) {
    var diff;
    diff = _.time() - startTime - 600;
    equal(errors, null);
    equal(values[0], 1);
    equal(values[1], 2);
    equal(values[2], "3 seconds");
    equal(diff > -acceptableOff, true);
    equal(diff < acceptableOff, true, "within " + diff + " off");
    return start();
  });
});
asyncTest("doTheseSync with error", function() {
  var startTime, todos;
  todos = [wait1Error, wait2, wait3];
  startTime = _.time();
  return _.doTheseSync(todos, function(errors, values) {
    var diff;
    equal(errors.length, 1);
    equal((__indexOf.call(values, 1) < 0), true);
    equal(values[1], 2);
    equal(values[2], "3 seconds");
    diff = _.time() - startTime - 600;
    equal(diff > -acceptableOff, true);
    equal(diff < acceptableOff, true, "within " + diff + " off");
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
  return causesError(_.hanlde(err, function(result) {
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
  return causesError(_.hanlde(err)(function(result) {
    result.push(result);
    equal(true, false);
    return start();
  }));
});
asyncTest("error helper with error and extra param ", function() {
  var err, errors, results;
  errors = [];
  results = [];
  err = function() {
    var error, extra;
    error = arguments[0], extra = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    errors.push(error);
    equal(errors.length, 1);
    equal(errors[0], "there was an error");
    equal(results.length, 0);
    equal(extra[0], "extra");
    equal(extra[1], "params");
    return start();
  };
  return causesError(_.hanlde([err, "extra", "params"], function(result) {
    results.push(result);
    equal(true, false);
    return start();
  }));
});
asyncTest("error helper with error alternate and extra param", function() {
  var err, errors, results;
  errors = [];
  results = [];
  err = function() {
    var error, extra;
    error = arguments[0], extra = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    errors.push(error);
    equal(errors.length, 1);
    equal(errors[0], "there was an error");
    equal(results.length, 0);
    equal(extra[0], "extra");
    equal(extra[1], "params");
    return start();
  };
  return causesError(_.hanlde([err, "extra", "params"])(function(result) {
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
  return doesntCauseError(_.hanlde(err, function(result, result2) {
    results.push(result);
    equal(results.length, 1);
    equal(results[0], "success");
    equal(result2, "you did it");
    equal(errors.length, 0);
    return start();
  }));
});
asyncTest("error helper good  alternate", function() {
  var err, errors, results;
  errors = [];
  results = [];
  err = function(error) {
    errors.push(error);
    equal(true, false);
    return start();
  };
  return doesntCauseError(_.hanlde(err)(function(result, result2) {
    results.push(result);
    equal(results.length, 1);
    equal(results[0], "success");
    equal(result2, "you did it");
    equal(errors.length, 0);
    return start();
  }));
});
test("Populate Array", function() {
  var obj;
  obj = {};
  _.populateArray(obj, "info", "the value");
  _.populateArray(obj, "info", "another");
  equal(obj.info[0], "the value", "populating blank array");
  equal(obj.info[1], "another", "populating existing array");
  obj.there = [];
  _.populateArray(obj, "there", "stuff");
  return equal(obj.there[0], "stuff", "array existed from the get-go");
});
try {
  _.assertFail("got this", "exptected this", "_.assertFail works", "==");
} catch (e) {
  _.assertEqual(e.message, "_.assertFail works");
  _.assertEqual(e.expected, "exptected this");
  _.assertEqual(e.actual, "got this");
  _.assertEqual(e.operator, "==");
}
_.assertOk(1, 1, "these equal");
try {
  _.assertOk(false, "don't equal");
} catch (e) {
  _.assertEqual(e.toString(), "AssertionError: don't equal", "Assert ok on false works");
  _.assertEqual(e.actual, false);
  _.assertEqual(e.expected, true, "should have expected true");
  _.assertEqual(e.message, "don't equal");
  _.assertEqual(e.operator, "==");
}
_.assertOk(1, "should be ok");
_.assertEqual(true, true, "true is true");
try {
  _.assertEqual(false, true, "true isn't false!");
} catch (e) {
  _.assertEqual(e.expected, true);
  _.assertEqual(e.actual, false);
  _.assertEqual(e.message, "true isn't false!");
  _.assertEqual(e.toString(), "AssertionError: true isn't false!");
  _.assertEqual(e.operator, "==");
}
_.assertNotEqual(false, true, "true isn't false on notEqual");
try {
  _.assertNotEqual(false, false, "notEqual error");
} catch (e) {
  _.assertEqual(e.expected, false);
  _.assertEqual(e.actual, false);
  _.assertEqual(e.operator, "!=");
}
console.log("pass " + (_.getPassCount()) + ", fail " + (_.getFailCount()) + ", total " + (_.getAssertCount()));
_.assertEqual(_.getAssertCount(), 25, "There should be 25 tests");
_.assertEqual(_.getFailCount(), 4, "4 failed tests");
_.assertEqual(_.getPassCount(), 23, "23 passed tests. There was 21 but 2 more tests since");
console.log("" + (_.getAssertCount()) + " tests ran. " + (_.getFailCount()) + " tests failed.4 were supposed to fail because were testing the tests");