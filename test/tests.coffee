module "My mixins"

wait2 = (err, done) ->
  _.wait 200, () ->
    console.log "2 seconds"
    done 2
wait3 = (err, done) ->
  _.wait 300, () ->
    console.log "3 seconds"
    done "3 seconds"

wait1 = (err, done) ->
  _.wait 100, () ->
    console.log "1 second"
    done 1

wait1Error = (err, done) ->
  _.wait 100, () ->
    console.log "error"
    err "There was an error"

causesError = (func) ->
  _.wait 100, () -> func "there was an error"

doesntCauseError = (func) ->
  _.wait 100, () -> func null, "success", "you did it"

acceptableOff = 40 

asyncTest "doThese", () ->
  startTime = _.time()
  _.doThese [wait2, wait1, wait3], (err, ret) ->
    equal err, null
    equal ret[0], 2
    equal ret[1], 1
    equal ret[2], "3 seconds"
    diff = _.time() - startTime - 300
    equal diff > -acceptableOff, true
    equal diff < acceptableOff, true, "within #{diff} off"
    start()

asyncTest "doTheseSync", () ->
  todos =  [wait1, wait2, wait3]
  startTime = _.time()
  _.doTheseSync todos, (errors, values) ->
    diff = _.time() - startTime - 600
    equal errors, null
    equal values[0], 1
    equal values[1], 2
    equal values[2], "3 seconds"
    equal diff > -acceptableOff, true
    equal diff < acceptableOff, true, "within #{diff} off"
    start()

asyncTest "doTheseSync with error", () ->
  todos =  [wait1Error, wait2, wait3]
  startTime = _.time()
  _.doTheseSync todos, (errors, values) ->
    equal errors.length, 1
    equal (1 not in values), true 
    equal values[1], 2
    equal values[2], "3 seconds"
    diff = _.time() - startTime - 600
    equal diff > -acceptableOff, true
    equal diff < acceptableOff, true, "within #{diff} off"
    start()

asyncTest "doThese with object", () ->
  todos =
    two: wait2
    three: wait3
    one: wait1
  _.doThese todos, (err, ret) ->
    equal err, null
    equal ret.two, 2
    equal ret.three, "3 seconds"
    equal ret.one, 1
    start()
    

asyncTest "doThese with error", () ->
  todos =
    two: wait2
    three: wait3
    one: wait1Error
  _.doThese todos, (err, ret) ->
    equal err.one, "There was an error"
    equal ret.two, 2
    equal ret.three, "3 seconds"
    equal ('one' not in ret), true 
    start()

asyncTest "error helper with error ", () ->
  errors = []
  results = []
  err = (error) ->
    errors.push error
    equal errors.length, 1
    equal errors[0], "there was an error"
    equal results.length, 0
    start()
  causesError _.hanlde err, (result) ->
    results.push result
    equal true, false # should never get here
    start()

asyncTest "error helper with error alternate", () ->
  errors = []
  results = []
  err = (error) ->
    errors.push error
    equal errors.length, 1
    equal errors[0], "there was an error"
    equal results.length, 0
    start()
  causesError _.hanlde(err) (result) ->
    result.push result
    equal true, false # should never get here
    start()


asyncTest "error helper with error and extra param ", () ->
  errors = []
  results = []
  err = (error, extra...) ->
    errors.push error
    equal errors.length, 1
    equal errors[0], "there was an error"
    equal results.length, 0
    equal extra[0], "extra"
    equal extra[1], "params"
    start()
  causesError _.hanlde [err, "extra", "params" ], (result) ->
    results.push result
    equal true, false # should never get here
    start()

asyncTest "error helper with error alternate and extra param", () ->
  errors = []
  results = []
  err = (error, extra...) ->
    errors.push error
    equal errors.length, 1
    equal errors[0], "there was an error"
    equal results.length, 0
    equal extra[0], "extra"
    equal extra[1], "params"
    start()
  causesError _.hanlde([err, "extra", "params"]) (result) ->
    result.push result
    equal true, false # should never get here
    start()

asyncTest "error helper good ", () ->
  errors = []
  results = []
  err = (error) ->
    errors.push error
    equal true, false # should never get here
    start()
  doesntCauseError _.hanlde err, (result, result2) ->
    results.push result
    equal results.length, 1
    equal results[0], "success"
    equal result2, "you did it"
    equal errors.length, 0
    start()


asyncTest "error helper good  alternate", () ->
  errors = []
  results = []
  err = (error) ->
    errors.push error
    equal true, false # should never get here
    start()
  doesntCauseError _.hanlde(err) (result, result2) ->
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



