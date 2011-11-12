(function() {
  var drews, log, s, sub, _;

  _ = require("underscore");

  drews = require("drews-mixins");

  log = _.log, s = _.s;

  sub = s("this is a string", 0, 4);

  log("'" + sub + "' should equal 'this'");

}).call(this);
