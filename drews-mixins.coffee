failCount = 0
passCount = 0
count = 0

class AssertionError extends Error
  constructor: (options) ->
    @name = 'AssertionError'
    @message = options.message
    @actual = options.actual
    @expected = options.expected
    @operator = options.operator

  toString: () =>
    [@name + ':', @message].join ' '

do () ->  
  
  drewsMixins = 
    # An abstraction for calling multiple asynchronous
    # functions at once, and calling a callback 
    # with the "return values" of all functions
    # when they are all done.
  
    doThese: (todos, callback) ->
      values = if _.isArray(todos) then [] else {}
      errors = _.clone values 
      length = if _.isArray(todos) then todos.length else _.keys(todos).length
      doneCount = 0
      makeError = (id) ->
        (err) ->
          doneCount += 1
          errors[id] = err
          if doneCount is length
            callback errors, values
      makeDone = (id) ->
        (ret) ->
          doneCount += 1
          values[id] = ret
          if doneCount is length
            if _.isEmpty(errors) then errors = null
            callback errors, values
      _.each todos, (todo, id) ->
        todo makeError(id), makeDone(id)


    doTheseSync: (todos, callback) ->
      values = if _.isArray(todos) then [] else {}
      errors = _.clone values 
      length = if _.isArray(todos) then todos.length else _.keys(todos).length
      doneCount = 0
      err = (ret) ->
        errors[doneCount] = ret
        doneCount += 1
        if doneCount is length
          callback errors, values
        else
          todos[doneCount] err, next
      next = (ret) ->
        values[doneCount] = ret
        doneCount += 1
        if doneCount is length
          if _.isEmpty(errors) then errors = null
          callback errors, values
        else
          todos[doneCount] err, next
      todos[0] err, next


      
    # method for handling errors more easily
    # instead of allways having to say `if err then ...`
    # You can use this error handler
    # see the tests for an examle usage
    hanlde: (errorFunc, callback) ->
      if _.isArray errorFunc
        extraArgs = _.s errorFunc, 1
        errorFunc = errorFunc[0]
      else
        extraArgs = []
      makeHandler = (func) ->
        (err, results...) ->
          if err then return errorFunc err, extraArgs...
          func results...
      if callback
        makeHandler callback
      else
        makeHandler

      

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
      if _.isNumber(str)
        return true
      if _.s(str, 0, 1) == "-"
        return true
      if _.s(str, 0, 1).match(/\d/)
        return true
      else
        return false

    capitalize: (str) ->
      str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

    # this is just a wrapper for setTimeout.
    # it puts the miliseconds first to it's more
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
      1
      # todo make a little map maker 

    populateArray: (obj, key, value) ->
      if not _.isArray obj[key]
        obj[key] = []
      obj[key].push value

    getAssertCount: -> count
    getFailCount: -> failCount
    getPassCount: -> passCount
      
    assertFail: (actual, expected, message, operator, stackStartFunction) ->
      failCount++
      count++
      e = 
        message: message
        actual: actual
        expected: expected
        operator: operator
        stackStartFunction: stackStartFunction
      console.log e
      throw new AssertionError e
    assertPass: (actual, expected, message, operator, stackStartFunction) ->
      passCount++
      count++
    assertOk: (value, message) ->
      if !!!value
        _.assertFail value, true, message, '==', _.assertOk
      else
        _.assertPass value, true, message, "==", _.assertOk
    assertEqual: (actual, expected, message) ->
      if `actual != expected`
        _.assertFail actual, expected, message, '==', _.assertEqual
      else
        _.assertPass actual, expected, message, "==", _.assertEqual
    assertNotEqual: (actual, expected, message) ->
      if `actual == expected`
        _.assertFail actual, expected, message, '!=', _.assertNotEqual
      else
        _.assertPass actual, expected, message, '!=', _.assertNotEqual

    #module.exports

  if module?.exports?
    module.exports = drewsMixins
  _?.mixin? drewsMixins
  root?._?.mixin? drewsMixins
    
