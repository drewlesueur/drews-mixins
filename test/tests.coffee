$(document).ready () ->
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
      


