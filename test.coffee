_ = require "underscore"
require("drews-mixins")(_)

sub = _.s "this is a test", 2, 2
_.assertEqual sub, "is"


console.log """
  #{_.getAssertCount()} tests ran
  #{_.getPassCount()} tests passed
  #{_.getFailCount()} tests failed
"""
