[![build status](https://secure.travis-ci.org/drewlesueur/drews-mixins.png)](http://travis-ci.org/drewlesueur/drews-mixins)
Drew's Mixins
=============
`drews-mixins` is a library of underscore.js mixins. You can
use it both in node.js and in the browser.

See tests at [http://drews-mixins.the.tl/test/test.html](http://drews-mixins.the.tl/test/test.html)

To install for node.js `npm install drews-mixins`

node.js example usage (in coffeescript)

    _ = require "underscore"
    require("drews-mixins") _
    _.s "the s is a substring", 0, 5 #--> "the s"

