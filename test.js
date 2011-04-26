(function() {
  var sub, _;
  _ = require("underscore");
  require("drews-mixins")(_);
  sub = _.s("this is a test", 2, 2);
  _.assertEqual(sub, "is");
  console.log("" + (_.getAssertCount()) + " tests ran\n" + (_.getPassCount()) + " tests passed\n" + (_.getFailCount()) + " tests failed");
}).call(this);
