$(document).ready () ->
  module "My mixins"

  wait2 = (done) ->
    _.wait 2000, () ->
      console.log "2 seconds"
      done 2
  wait3 = (done) ->
    _.wait 3000, () ->
      console.log "3 seconds"
      done "3 seconds"

  wait1 = (done) ->
    _.wait 1000, () ->
      console.log "1 second"
      done 1

  asyncTest "doThese", () ->
        
    _.doThese [wait2, wait1, wait3], (ret) ->
      equal ret[0], 2
      equal ret[1], 1
      equal ret[2], "3 seconds"
      start()

  asyncTest "doThese with object", () ->
    todos =
      two: wait2
      three: wait3
      one: wait1
    _.doThese todos, (ret) ->
      equal ret.two, 2
      equal ret.three, "3 seconds"
      equal ret.one, 1
      
