(function() {
  var addToObj, addToObjectMaker, allDone, allTestsDone, asyncEx, before, befores, cb, doneMaker, eq, isEqual, nimble, ok, s, str, stuff, sub, test, testDone, tests, wait, _, _ref, _ref2;

  _ = require("underscore");

  nimble = require("nimble");

  require("./drews-mixins")(_);

  _.mixin(nimble);

  eq = _.assertEqual, s = _.s, doneMaker = _.doneMaker, ok = _.assertOk, asyncEx = _.asyncEx, wait = _.wait, isEqual = _.isEqual, addToObjectMaker = _.addToObjectMaker;

  tests = {};

  befores = {};

  test = addToObjectMaker(tests);

  before = addToObjectMaker(befores);

  stuff = {};

  addToObj = addToObjectMaker(stuff);

  addToObj("name", "aterciopelados");

  addToObj("cd", "rio");

  eq(stuff.name, "aterciopelados", "name should be aterciopelados");

  str = "this is a test";

  sub = s(str, 2, 2);

  eq(sub, "is");

  eq(s(str, -1), "t");

  _ref = doneMaker(), testDone = _ref[0], allTestsDone = _ref[1];

  _ref2 = doneMaker(), cb = _ref2[0], allDone = _ref2[1];

  (function() {
    var done;
    done = testDone();
    asyncEx(100, cb());
    asyncEx(500, cb());
    asyncEx(300, cb());
    wait(100, function() {
      return asyncEx(50, cb());
    });
    wait(600, function() {
      return asyncEx(20, cb());
    });
    return allDone(function(err, results) {
      console.log("finished");
      console.log(results);
      ok(isEqual(results, [100, 500, 300, 50]), "should get my async results");
      console.log("done");
      return done();
    });
  })();

  allTestsDone(function(err, results) {
    return console.log("" + (_.getAssertCount()) + " tests ran\n" + (_.getPassCount()) + " tests passed\n" + (_.getFailCount()) + " tests failed");
  });

}).call(this);
