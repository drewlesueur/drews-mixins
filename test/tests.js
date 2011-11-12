(function() {
  var causesError, doesntCauseError, fakeGetAudio, fakeGetPictures, fakeGetVideos, tasks;
  var __slice = Array.prototype.slice;

  module("My mixins");

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

  asyncTest("error helper with error ", function() {
    var done, errors, results;
    errors = [];
    results = [];
    done = function(error, result) {
      errors.push(error);
      equal(errors.length, 1);
      equal(errors[0], "there was an error");
      equal(results.length, 0);
      return start();
    };
    return causesError(_.graceful(done, function(result) {
      results.push(result);
      equal(true, false);
      return start();
    }));
  });

  asyncTest("error helper with error alternate", function() {
    var done, errors, results;
    errors = [];
    results = [];
    done = function(error) {
      errors.push(error);
      equal(errors.length, 1);
      equal(errors[0], "there was an error");
      equal(results.length, 0);
      return start();
    };
    return causesError(_.graceful(done)(function(result) {
      result.push(result);
      equal(true, false);
      return start();
    }));
  });

  asyncTest("error helper with error and extra param ", function() {
    var done, errors, results;
    errors = [];
    results = [];
    done = function() {
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
    return causesError(_.graceful([done, "extra", "params"], function(result) {
      results.push(result);
      equal(true, false);
      return start();
    }));
  });

  asyncTest("error helper with error alternate and extra param", function() {
    var done, errors, results;
    errors = [];
    results = [];
    done = function() {
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
    return causesError(_.graceful([done, "extra", "params"])(function(result) {
      result.push(result);
      equal(true, false);
      return start();
    }));
  });

  asyncTest("error helper good ", function() {
    var done, errors, results;
    errors = [];
    results = [];
    done = function(error) {
      errors.push(error);
      equal(true, false);
      return start();
    };
    return doesntCauseError(_.graceful(done, function(result, result2) {
      results.push(result);
      equal(results.length, 1);
      equal(results[0], "success");
      equal(result2, "you did it");
      equal(errors.length, 0);
      return start();
    }));
  });

  asyncTest("error helper good  alternate", function() {
    var done, errors, results;
    errors = [];
    results = [];
    done = function(error) {
      errors.push(error);
      equal(true, false);
      return start();
    };
    return doesntCauseError(_.graceful(done)(function(result, result2) {
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

  fakeGetVideos = function(url, done) {
    return _.wait(100, function() {
      return done("no videos allowed");
    });
  };

  fakeGetPictures = function(accountId, done) {
    return _.wait(200, function() {
      return done(null, ["pic1", "pic2"]);
    });
  };

  fakeGetAudio = function(tagName, done) {
    return _.wait(300, function() {
      return done(null, ["hello.wav"]);
    });
  };

  tasks = {
    videos: function(done) {
      return fakeGetVideos("http://.com", _.graceful(done, function(videos) {
        return done(null, videos);
      }));
    },
    pics: function(done) {
      return fakeGetPictures("xyzzy", _.graceful(done, function(pics) {
        return done(null, pics);
      }));
    },
    audio: function(done) {
      return fakeGetAudio("trees", _.graceful(done, function(audio) {
        return done(null, audio);
      }));
    }
  };

  _.parallel(tasks, function(err, values) {
    _.assertEqual(err, null, "final error should be null");
    _.assertEqual(values.videos, null, "videos should be null");
    _.assertOk(_.isEqual(values.pics, ["pic1", "pic2"]));
    return _.assertOk(_.isEqual(values.audio, ["hello.wav"]));
  });

  console.log("" + (_.getAssertCount()) + " tests ran. " + (_.getFailCount()) + " tests failed.4 were supposed to fail because were testing the tests.");

}).call(this);
