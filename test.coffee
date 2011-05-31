_ = require "underscore"
nimble = require "nimble"
require("./drews-mixins") _
_.mixin nimble

{
  assertEqual: eq
  s
  doneMaker:doneMaker
  assertOk: ok
  asyncEx
  wait
  isEqual
} = _
str = "this is a test"
sub = s str, 2, 2
eq sub, "is"
eq s(str,-1), "t"
[testDone, allTestsDone] = doneMaker()
[cb, allDone] = doneMaker()


do ->
  done = testDone()
  asyncEx 100, cb()
  asyncEx 500, cb()
  asyncEx 300, cb()
  wait 100, () ->
    asyncEx 50, cb()
  wait 600, ->
    asyncEx 20, cb() #this wont get called

  allDone (err, results) ->
    console.log "finished"
    console.log results
    ok isEqual(results, [100,500,300, 50]), "should get my async results"
    console.log "done"
    done()

allTestsDone (err, results) ->
  console.log """
    #{_.getAssertCount()} tests ran
    #{_.getPassCount()} tests passed
    #{_.getFailCount()} tests failed
  """
   




