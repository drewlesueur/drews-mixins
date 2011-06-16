#make sure you compile iwth -cw not -cwb
drew = {}
#this project used to have async helpers until i found @caolan's
#nimble project




failCount = 0
passCount = 0
count = 0
failedMessages = []

class AssertionError extends Error
  constructor: (options) ->
    @name = 'AssertionError'
    @message = options.message
    @actual = options.actual
    @expected = options.expected
    @operator = options.operator

  toString: () =>
    "test"
    [@name + ':', @message].join ' '

    # wait for





goAndDo = (exports, _) ->  
  exports.asyncEx = (len, cb) ->
    _.wait len, -> cb null, len 

  exports.asyncFail = (len, cb) ->
    _.wait len, -> cb len
    
  exports.doneMaker = () ->
    allDoneCallback = ->
    results = []
    allDone = (cb) ->
      allDoneCallback = cb
    id = _.uniqueId()
    length = 0
    doneLength = 0
    live = true
    done = () ->
      myLength = length
      length++ 
      return do (myLength) -> (err, result) ->
        if live is false then return
        doneLength++
        if err then allDoneCallback err, results
        results[myLength] = result
        if doneLength is length
          allDoneCallback null, results
          live = false
    [done, allDone]
          
  
  #think about old wrapper objects sometime

  # some backbone.js-like events, consider using node.js like ones 
  # compare backbones events with nodes events
  # https://github.com/joyent/node/blob/master/lib/events.js
  # https://github.com/documentcloud/backbone/blob/master/backbone.js
  # https://github.com/maccman/spine/blob/master/spine.js


  exports.on = (obj, ev, callback) ->
    calls = obj._callbacks || obj._callbacks = {}
    list = calls[ev] || (calls[ev] = [])
    list.push callback
    obj._events = obj._callbacks
    obj
  exports.removeListener = (obj, ev, callback) ->
    if (!ev)
      obj._callbacks = {}
      obj._events = obj._callbacks
    else if calls = obj._callbacks
      if !callback
        calls[ev] = []
      else
        list = calls[ev]
        if !list then return obj
        for item, i in list
          if callback == list[i]
            list.splice i, 1 #spine.js
            #list[i] = null #backbone.js
            # then backbone clearns the nulls later
            # node.js copies the array when triggering 
            # so the once isn't a problem
            break
    obj
  #TODO async events? wait 0, ->
  exports.emit = (obj, eventName, args...) ->
    both = 2
    id = _.uniqueId()
    if !(calls = obj._callbacks) then return obj
    while both--
      ev = if both then eventName else  "all"
      list = calls[ev]
      
      if list=calls[ev]
        # then next line coppies the array
        # so it doesn't get shrinked by a once
        # backbone.js has maybe a more efficient way
        # where unbind sets it to null, and here it slices them
        # if they are null
        list = list.slice() #stole this from node.js events
        for item, i in list
          callback = list[i]
          if not callback

          else
            args = if both then args else args.unshift(eventName)
            # maby have obj as the first param?
            callback.apply obj, args
  exports.trigger = exports.emit
  exports.addListener = exports.on
  exports.unbind = exports.removeListener
  exports.once = (obj, ev, callback) ->
    g = (args...) ->
      _.removeListener obj, ev, g
      callback.apply obj, args 
    _.addListener obj, ev, g
  
    




  exports.graceful = (errorFunc, callback) ->
    if _.isArray errorFunc
      extraArgs = _.s errorFunc, 1
      errorFunc = errorFunc[0]
    else
      extraArgs = []
    makeHandler = (func) ->
      (err, results...) ->
        if err
          #return errorFunc null, err, extraArgs...
          return errorFunc.apply null, null, null
        func results...
    if callback
      makeHandler callback
    else
      makeHandler
    

  #simple substring/slice functionality
  # for arrays and strings
  # very similar to php's subst and php's array_slice 
  exports.s = (val, start, end) ->
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

  exports.startsWith = (str, with_what) ->
    _.s(str, 0, with_what.length) == with_what
  
  exports.rnd = (low, high) -> Math.floor(Math.random() * (high-low+1)) + low

  exports.time = () ->
    (new Date()).getTime()

  exports.replaceBetween = (str, start, between, end) ->
    pos = str.indexOf start
    if pos is -1 then return str
    endpos = str.indexOf end, pos + start.length
    if endpos is -1 then return str
    return _.s(str, 0, pos + start.length) + between + _.s(str, endpos)
  exports.trimLeft = (obj) ->
    obj.toString().replace(/^\s+/, "")
  exports.trimRight = (obj) ->
    obj.toString().replace(/\s+$/, "")
  exports.isNumeric = (str) ->
    if _.isNumber(str)
      return true
    if _.s(str, 0, 1) == "-"
      return true
    if _.s(str, 0, 1).match(/\d/)
      return true
    else
      return false

  exports.capitalize = (str) ->
    str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

  # this is just a wrapper for setTimeout.
  # it puts the miliseconds first to it's more
  # natural to write in coffeescript

  exports.wait = (miliseconds, func) ->
    setTimeout func, miliseconds
  times = (numb, func) ->
    for i in [1..numb]
      func i

  exports.interval = (miliseconds, func) ->
    setInterval func, miliseconds

  exports.compareArrays = (left, right) ->
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

  exports.pacManMapMaker = (left, right, top, bottom) ->
    1
    # todo make a little map maker 

  exports.populateArray = (obj, key, value) ->
    if not _.isArray obj[key]
      obj[key] = []
    obj[key].push value

  createCommunicator = (url) ->
    # cross document messaging communicator api
    loaded = false
    iframe = document.createElement "iframe"
    $(iframe).load () ->
      loaded = true

      
    
  #maybe to one for add to array 
  addToObject = (obj, key, value) ->
    obj[key] = value
  addToObjectMaker = (obj) ->
    (key, value) ->
      addToObject obj, key, value
  exports.addToObjectMaker = addToObjectMaker

  jsonHttpMaker = (method) ->
    http = (args..., callback) ->
      [url, args, contentType] = args
      #TODO: why does the {} work?
      data = JSON.stringify args || {}
      $.ajax 
        url: "#{method}"
        type: method || "POST"
        contentType: 'application/json' || contentType
        data: data
        dataType: 'json'
        processData: false
        success: (data) -> callback null, data
        error: (data) -> 
          callback JSON.parse data.responseText
  exports.jsonPost = jsonHttpMaker "POST"
  exports.jsonGet = jsonHttpMaker "GET"
  exports.jsonHttpMaker = jsonHttpMaker
  # get = ajaxMaker "get"
  # asyncTests = (batches, tests) ->
  #   before = addToObjectMaker()
  #   test = addToObjectMaker()
  #   prepareTests = () ->
  #     _.series batches
  ###    
  do ->
    giveBackTheCard = takeACard()



    giveBackTheCard()
    ###

  exports.getAssertCount = -> count
  exports.getFailCount = -> failCount
  exports.getPassCount =  -> passCount
  exports.setAssertCount = (newCount) -> count = newCount
  exports.setPassCount = (newCount) -> passCount = newCount
  exports.setFailCount = (newCount) -> failCount = newCount
  exports.getFailedMessages = () -> failedMessages

    
  exports.assertFail = (actual, expected, message, operator, stackStartFunction) ->
    failCount++
    count++
    failedMessages.push message
    e = 
      message: message
      actual: actual
      expected: expected
      operator: operator
      stackStartFunction: stackStartFunction
    console.log e
    #throw new AssertionError e
  exports.assertPass = (actual, expected, message, operator, stackStartFunction) ->
    passCount++
    count++
  exports.assertOk = (value, message) ->
    if !!!value
      _.assertFail value, true, message, '==', exports.assertOk
    else
      _.assertPass value, true, message, "==", _.assertOk 
  exports.assertEqual = (actual, expected, message) ->
    if `actual != expected`
      _.assertFail actual, expected, message, '==', exports.assertEqual
    else
      _.assertPass actual, expected, message, "==", exports.assertEqual
  exports.assertNotEqual = (actual, expected, message) ->
    if `actual == expected`
      _.assertFail actual, expected, message, '!=', exports.assertNotEqual
    else
      _.assertPass actual, expected, message, '!=', exports.assertNotEqual


if typeof exports  == 'undefined'
  _ = this._ || {}
  goAndDo drew, _
  _.mixin drew
else
  module.exports = (_) ->
    goAndDo drew, _
    _.mixin drew

#root._ if root._ is defined in parent script 
