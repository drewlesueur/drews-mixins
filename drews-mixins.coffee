drew = {}

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
    "test"
    [@name + ':', @message].join ' '

goAndDo = (exports, _) ->  
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

  exports.getAssertCount = -> count
  exports.getFailCount = -> failCount
  exports.getPassCount =  -> passCount
  exports.setAssertCount = (newCount) -> count = newCount
  exports.setPassCount = (newCount) -> passCount = newCount
  exports.setFailCount = (newCount) -> failCount = newCount

    
  exports.assertFail = (actual, expected, message, operator, stackStartFunction) ->
    failCount++
    count++
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
