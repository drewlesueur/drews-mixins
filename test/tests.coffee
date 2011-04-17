module "My mixins"


causesError = (func) ->
  _.wait 100, () -> func "there was an error"

doesntCauseError = (func) ->
  _.wait 100, () -> func null, "success", "you did it"



asyncTest "error helper with error ", () ->
  errors = []
  results = []
  done = (error, result) ->
    errors.push error
    equal errors.length, 1
    equal errors[0], "there was an error"
    equal results.length, 0
    start()
  causesError _.graceful done, (result) ->
    results.push result
    equal true, false # should never get here
    start()

asyncTest "error helper with error alternate", () ->
  errors = []
  results = []
  done = (error) ->
    errors.push error
    equal errors.length, 1
    equal errors[0], "there was an error"
    equal results.length, 0
    start()
  causesError _.graceful(done) (result) ->
    result.push result
    equal true, false # should never get here
    start()


asyncTest "error helper with error and extra param ", () ->
  errors = []
  results = []
  done = (error, extra...) ->
    errors.push error
    equal errors.length, 1
    equal errors[0], "there was an error"
    equal results.length, 0
    equal extra[0], "extra"
    equal extra[1], "params"
    start()
  causesError _.graceful [done, "extra", "params" ], (result) ->
    results.push result
    equal true, false # should never get here
    start()

asyncTest "error helper with error alternate and extra param", () ->
  errors = []
  results = []
  done = (error, extra...) ->
    errors.push error
    equal errors.length, 1
    equal errors[0], "there was an error"
    equal results.length, 0
    equal extra[0], "extra"
    equal extra[1], "params"
    start()
  causesError _.graceful([done, "extra", "params"]) (result) ->
    result.push result
    equal true, false # should never get here
    start()

asyncTest "error helper good ", () ->
  errors = []
  results = []
  done = (error) ->
    errors.push error
    equal true, false # should never get here
    start()
  doesntCauseError _.graceful done, (result, result2) ->
    results.push result
    equal results.length, 1
    equal results[0], "success"
    equal result2, "you did it"
    equal errors.length, 0
    start()


asyncTest "error helper good  alternate", () ->
  errors = []
  results = []
  done = (error) ->
    errors.push error
    equal true, false # should never get here
    start()
  doesntCauseError _.graceful(done) (result, result2) ->
    results.push result
    equal results.length, 1
    equal results[0], "success"
    equal result2, "you did it"
    equal errors.length, 0
    start()

test "Populate Array", () ->
  obj = {}
  _.populateArray obj, "info", "the value"
  _.populateArray obj, "info", "another"
  equal obj.info[0], "the value", "populating blank array"
  equal obj.info[1], "another", "populating existing array"

  obj.there = []
  _.populateArray obj, "there", "stuff"
  equal obj.there[0], "stuff", "array existed from the get-go"
    

try
  _.assertFail "got this", "exptected this", "_.assertFail works", "=="
catch e
  _.assertEqual e.message, "_.assertFail works"
  _.assertEqual e.expected, "exptected this"
  _.assertEqual e.actual, "got this"
  _.assertEqual e.operator, "=="

_.assertOk 1, 1, "these equal"

try
  _.assertOk false, "don't equal"
catch e
  _.assertEqual e.toString(), "AssertionError: don't equal", "Assert ok on false works"
  _.assertEqual e.actual,false
  _.assertEqual e.expected, true, "should have expected true"
  _.assertEqual e.message, "don't equal"
  _.assertEqual e.operator, "=="

_.assertOk 1, "should be ok"

_.assertEqual true, true, "true is true"

try
  _.assertEqual false, true, "true isn't false!"
catch e
  _.assertEqual e.expected, true
  _.assertEqual e.actual, false
  _.assertEqual e.message, "true isn't false!"
  _.assertEqual e.toString(), "AssertionError: true isn't false!"
  _.assertEqual e.operator, "=="
 

_.assertNotEqual false, true, "true isn't false on notEqual"

try
  _.assertNotEqual false, false, "notEqual error"
catch e
  _.assertEqual e.expected, false
  _.assertEqual e.actual, false
  _.assertEqual e.operator, "!="



console.log "pass #{_.getPassCount()}, fail #{_.getFailCount()}, total #{_.getAssertCount()}"
_.assertEqual _.getAssertCount(), 25, "There should be 25 tests"
_.assertEqual _.getFailCount(), 4, "4 failed tests"
_.assertEqual _.getPassCount(), 23, "23 passed tests. There was 21 but 2 more tests since" 


console.log "#{_.getAssertCount()} tests ran. #{_.getFailCount()} tests failed.
4 were supposed to fail because were testing the tests
"



