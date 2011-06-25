_ = require "underscore"
drews = require "drews-mixins"

{log, s} = _

sub = s "this is a string", 0, 4

log "'#{sub}' should equal 'this'"
