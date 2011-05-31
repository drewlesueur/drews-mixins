(function() {
  var asyncEx, doneMaker, eq, nimble, ok, s, str, sub, wait, _;
  _ = require("underscore");
  nimble = require("nimble");
  require("./drews-mixins")(_);
  _.mixin(nimble);
  eq = _.assertEqual, s = _.s, doneMaker = _.doneMaker, ok = _.assertOk, asyncEx = _.asyncEx, wait = _.wait;
  console.log(doneMaker.length);
  str = "this is a test";
  sub = s(str, 2, 2);
  eq(sub, "is");
  eq(s(str, -1), "t");
  /*
  [cb, allDone] = doneMaker()
  asyncEx 100, cb()
  asyncEx 2000, cb()
  asyncEx 500, cb()
  
  allDone (err, results) ->
    ok isEqual(results, [100,2000,500]), "should get my async results"
  */
  console.log("" + (_.getAssertCount()) + " tests ran\n" + (_.getPassCount()) + " tests passed\n" + (_.getFailCount()) + " tests failed");
}).call(this);
