(function() {
  $(document).ready(function() {
    var wait1, wait2, wait3;
    module("My mixins");
    wait2 = function(done) {
      return _.wait(2000, function() {
        console.log("2 seconds");
        return done(2);
      });
    };
    wait3 = function(done) {
      return _.wait(3000, function() {
        console.log("3 seconds");
        return done("3 seconds");
      });
    };
    wait1 = function(done) {
      return _.wait(1000, function() {
        console.log("1 second");
        return done(1);
      });
    };
    asyncTest("doThese", function() {
      return _.doThese([wait2, wait1, wait3], function(ret) {
        equal(ret[0], 2);
        equal(ret[1], 1);
        equal(ret[2], "3 seconds");
        return start();
      });
    });
    return asyncTest("doThese with object", function() {
      var todos;
      todos = {
        two: wait2,
        three: wait3,
        one: wait1
      };
      return _.doThese(todos, function(ret) {
        equal(ret.two, 2);
        equal(ret.three, "3 seconds");
        equal(ret.one, 1);
        return start();
      });
    });
  });
}).call(this);
