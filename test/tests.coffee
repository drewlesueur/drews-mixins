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

  

  asyncTest "doThese", () ->
        
    _.doThese [wait2, wait1, wait3], (err, ret) ->
      equal err, null
      equal ret[0], 2
      equal ret[1], 1
      equal ret[2], "3 seconds"
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
    causesError _.errorHelper err, (result) ->
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
    causesError _.errorHelper(err) (result) ->
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
    doesntCauseError _.errorHelper err, (result, result2) ->
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
    doesntCauseError _.errorHelper(err) (result, result2) ->
      results.push result
      equal results.length, 1
      equal results[0], "success"
      equal result2, "you did it"
      equal errors.length, 0
      start()


