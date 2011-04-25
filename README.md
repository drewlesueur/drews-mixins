Drew's Mixins
=============
`drews-mixins` is a library of underscore.js mixins. You can
use it both in node.js and in the browser.

See tests at [http://drews-mixins.the.tl/test/test.html](http://drews-mixins.the.tl/test/test.html)

To install for node.js `npm install drews-mixins`

node.js example usage (in coffeescript)

    _ = require "underscore"
    drews = require "drews-mixins"
    _.mixin drews
    _.s "the s is a substring", 0, 5 #--> "the s"

I also embedded my fork of the extremely awesome nimble library

  * My fork:  https://github.com/drewlesueur/nimble
  * Original nimble project: https://github.com/caolan/nimble

The reason why I forked: https://github.com/caolan/nimble/pull/1

(Hopefully my pull request gets accepted :). If it does, I wont include nimble in this project)

