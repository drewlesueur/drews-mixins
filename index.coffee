_.mixin
  #simple substring/slice functionality
  # for arrays and strings
  # very similar to php's subst and php's array_slice 
  s: (val, start, end) ->
    need_to_join = false
    ret = []
    if _.isString val
      val = val.split ""
      need_to_join = true
    
    if start >= 0
    else
      start = val.length + start
    
    if _.isUndefined(end)
      ret = val.slice start
    else
      if end < 0
        end = val.length + end
      else
        end = end + start
      ret = val.slice start, end

    if need_to_join
      ret.join ""
    else
      ret

  startsWith: (str, with_what) ->
    _.s(str, 0, with_what.length) == with_what
  
  rnd: (low, high) -> Math.floor(Math.random() * (high-low+1)) + low

  time: () ->
    (new Date()).getTime()

  replaceBetween: (str, start, between, end) ->
    pos = str.indexOf start
    if pos is -1 then return str
    endpos = str.indexOf end, pos + start.length
    if endpos is -1 then return str
    return _.s(str, 0, pos + start.length) + between + _.s(str, endpos)
  trimLeft: (obj) ->
    obj.toString().replace(/^\s+/, "")
  trimRight: (obj) ->
    obj.toString().replace(/\s+$/, "")
  isNumeric: (str) ->
    _.s(str, 0, 1).match(/\d/)

  capitalize: (str) ->
    str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

  # this is just a wrapper for setTimeout.
  # it puts the miliseconds first to sits more
  # natural to write in coffeescript

  wait: (miliseconds, func) ->
    setTimeout func, miliseconds

  interval : (miliseconds, func) ->
    setInterval func, miliseconds

  compareArrays: (left, right) ->
    #not yet optimized
    inLeftNotRight = []
    inRightNotLeft = []
    inBoth = []
    for item in left
      if item in right
        inBoth.push item
      else
        inLeftNotRight.push item

    for item in right
      if item not in left
        inRightNotLeft.push item 

    return [inLeftNotRight, inRightNotLeft, inBoth]

  pacManMapMaker: (left, right, top, bottom) ->
    # todo make a little map maker 




# An abstraction for calling multiple asynchronous
# functions at once, and calling a callback 
# with the "return values" of all functions
# when they are all done.
# requires underscore.js

  doThese: (todos, callback) ->
    returnValues = if _.isArray(todos) then [] else {}
    makeJobsDone = (id) ->
      return (ret) ->
        returnValues[id] = ret
        allDone = true
        _.each todos, (func, id) ->
          if not(id of returnValues)
            allDone = false
            #_.breakLoop()
        if allDone is true
          callback(returnValues)
    _.each todos, (todo, id) ->
      jobsDone = makeJobsDone(id)
      todo(jobsDone)

