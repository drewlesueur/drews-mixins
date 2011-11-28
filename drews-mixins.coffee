#make sure you compile iwth -cw not -cwb
#this project used to have async helpers until i found @caolan's
#nimble project

dModule.define "drews-mixins", ->
  _ = dModule.require "underscore"
  exports = {}

  exports.testing = do ->
    success = 0
    total = 0
    failed = false
    outStandingAsyncTests = 0
    start = 0

    testing = {}

    init = () ->
      if start == 0
        start = new Date

    fin = testing.fin = () ->
      if outStandingAsyncTests == 0
        yay = success is total and not failed
        sec = (new Date - start) / 1000
        msg = "passed #{success} tests in #{ sec.toFixed 2 } seconds"
        msg = "failed #{ total - success } tests and #{msg}" unless yay
        console.log msg, yay
    ok = testing.ok = (val, message) ->
      init()
      message or= "#{val} is not true"
      total += 1
      if val
        success += 1
      else
        throw Error message

    eq = testing.eq = (x, y, message) ->
      init()
      message or= "#{x} doesn't equal #{y}"
      ok x is y, message

    equalish = testing.equalish = (x, y, message) -> 
      init()
      message or= "#{JSON.stringify x} doesn't equal #{JSON.stringify y}"
      ok _.isEqual(x, y), message

    test = testing.test = (description, func) ->
      init()
      func()

    asyncTest = testing.asyncTest = (description, func) ->
      init()
      outStandingAsyncTests += 1
      func (err) ->
        outStandingAsyncTests -= 1
        fin()

    testing


    
  exports.doneMaker2 = () ->
    allDoneCallback = ->
    allDone = (cb) ->
      allDoneCallback = cb
    id = _.uniqueId()
    length = 0
    doneLength = 0
    live = true
    done = (err) ->
      if live is false then return
      doneLength++
      if err then allDoneCallback err
      if doneLength is length
        allDoneCallback null
        live = false
    hold = -> length++ 
    [hold, done, allDone]

      

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
  trigger = (obj, ev, args...) ->
    #ev is eventname
    if !(calls = obj._callbacks) then return obj
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
        if callback
          # maby have obj as the first param?
          callback.apply obj, args
    obj
  exports.trigger = trigger
  exports.emit = exports.trigger
  
  exports.addListener = exports.on
  exports.unbind = exports.removeListener
  exports.once = (obj, ev, callback) ->
    g = (args...) ->
      exports.removeListener obj, ev, g
      callback.apply obj, args 
    exports.addListener obj, ev, g
    obj
  
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
  
  exports.rnd = (low=0, high=100) -> Math.floor(Math.random() * (high-low+1)) + low

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
    # there is an error in the duplication code
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

    dupLeft = []
    dupRight = []
    for item, key in left
      if (item in _.s left, 0, key - 1) or (item in _.s left, key+1)
        dupLeft[item] = ""
    for item, key in right
      if (item in _.s right, 0, key - 1) or (item in _.s right, key+1)
        dupRight[item] = ""

    dupLeft = _.keys dupLeft
    dupRight = _.keys dupRight


    return [inLeftNotRight, inRightNotLeft, inBoth, dupLeft, dupRight]

  exports.pacManMapMaker = (left, right, top, bottom) ->
    1
    # todo make a little map maker 

  exports.populateArray = (obj, key, value) ->
    if not _.isArray obj[key]
      obj[key] = []
    obj[key].push value

  setLocation = (stuff, cb) ->
  log = (args...) -> console?.log args... 
  exports.log = log

  hosty = null 
      
  #deprecated  
  postMessageHelper = (yourWin, origin, methods={}) ->
    self = {}
    host = {}
    # methods that can be called on me
    self.addMethods = (fns) ->
      _.extend methods, fns 
    self.addMethods
      bind: (event, callback) ->
      #?????
    events = {}
    callbacks = {} 
    #origin = yourWin.location.origin # cant do
    #origin = _origin # or something

    #???
    #???    
    self.trigger = ->
    self.write = -> #sream data
    # then need a self.ondata self.onend callbacks
    # trigger self, "data"
    # trigger self, "end"
    #  or something else
    self.trigger = (event, params...) ->

    # self.bind not done yet    
    self.bind = (event, callback) ->
      id = _.uuid() 
      subscribe = 
        channel: event
        id: id
      subscribeString = JSON.stringify subscribe
      events[event] ||= []
      events[event].push callback
      yourWin.postMessage subscribeString, origin
      
    self.call = (method, params..., callback) ->    
      id = _.uuid()
      request =
        method: method
        params: params
        id: id
      requestString = JSON.stringify request
      callbacks[id] = callback
      yourWin.postMessage requestString, origin  
    $(window).bind "message", (e) ->
      e = e.originalEvent #only needed for jQuery
      if e.origin != origin and origin != "*" 
        return
      message = JSON.parse e.data
      if "result" of message
        # i called another window & they're responding
        {id, error, result} = message
        callbacks[id]? error, result
      else if "method" of message
        # another window is calling me
        {method, params, id} = message
        # by defualt makeing it async
        methods[method]? params..., (err=null, result=null) ->
          response =
            error: err
            result: result
            id: id
          responseString = JSON.stringify response
          #e.source.postMessage
          yourWin.postMessage responseString, origin
    self
      
    # win is an iframe.contentWindow or other window
      
  exports.postMessageHelper = postMessageHelper
  exports.uuid = () ->
    #http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    `'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});` 
    
  # global error handler maker
  # pass it an array of fns and get 
  # their async error gets hendled by the handler
  # work in progress
  errorHandleMaker = (fns, handler) ->
    ret = []
    wasArray = true
    if not _.isArray(fns)
      fn = [fns]
      wasArray = false
    _.each fns, (fn) ->
      ret.push (args..., cb) ->
        fn args..., (err, result) ->
          if err
            handler err, result
          cb err, result
     if wasArray
       ret
     else
       ret[0]
          


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
      #TODOO: why does the {} work?
      data = JSON.stringify args || {}
      if module?.exports #if node.js
        http = require "http"
        urlLib = require "url"
        urlObj = urlLib.parse url
        req = http.request
          host: urlObj.hostname
          path: urlObj.pathname
          port: urlObj.port
          method: method or "POST"
          headers:
            "Content-Type": "application/json"
            "Content-Length": data.length
          (res) ->
            responseText = ""
            res.on "data", (chunk) ->
              responseText += chunk.toString()
            res.on "end", () ->
              callback null, JSON.parse responseText
            res.on "close", (err) ->
              callback err
        req.on "error", (e) -> callback e
        req.write data
        req.end()
      else
        $.ajax 
          url: "#{url}"
          type: method || "POST"
          contentType: 'application/json' || contentType
          data: data
          dataType: 'json'
          processData: false
          success: (data) -> callback null, data
          error: (data) -> 
            callback JSON.parse data.responseText
  jsonPost = jsonHttpMaker "POST"
  jsonGet = jsonHttpMaker "GET"
  jsonHttpMaker = jsonHttpMaker

  ###
  # example node.js method for handling this rpc
  pg "/rpc", (req, res) ->
    body = req.body
    {method, params, id} = body
    log method, params, id
    log rpcMethods[method]
    rpcMethods[method] params..., (err, result) ->
      res.send
        result: result
        error: err
        id: id
  ###

  jsonRpcMaker = (url) ->
    (method, args..., callback) ->
      jsonPost url,
        method: method,
        params: args
        id : _.uuid() 
      , (err, data) ->
        {result, error, id} = data 
        callback? (error or err), result

  metaObjects = {}
  meta = (obj, defaulto={}) ->
    if not (typeof obj == "object")
      return undefined
    if "__mid" of obj
      return metaObjects[obj.__mid]
    else
      __mid = _.uniqueId()
      obj.__mid = __mid
      metaObjects[__mid] = defaulto
  set = (obj, values) ->
    _.each values, (value, key) ->
      changed = {}
      oldVals = {}
      if obj[key] != value
        oldVal = obj[key]
        oldVals[key] = oldVal
        obj[key] = value
        changed[key] = value
        trigger obj, "change:#{key}", key, newVal, oldVal 
    if changed.length > 0
      trigger obj, "change", changed, oldVals
  metaMaker = (val) -> 
    (obj, defaulto={}) -> (meta obj)[val] || (meta obj)[val] = defaulto
   
  # one ting is member_missing
  # another thing is aop beforecall after call
  # this is just a member missing deal 
  # stooges = [{name : 'curly', age : 25}, {name : 'moe', age : 21}, {name : 'larry', age : 23}]
  #  log (p stooges)("sortBy")((stooge) -> stooge.age)(_.map)((s) -> s.name == "larry")()
  #  log (p stooges)("sortBy")((stooge) -> stooge.age)("map")((s) -> s.name == "larry")()

  #  a =
  #    name: "drew"
  #    member_missing: (obj, member) ->
  #      return "yes I can #{member}"

  #  for thing in ["run", "name", "walk", "jog"]
  #    log (p a, thing)

  #  (p a, "walk")
    
      
  polymorphic = (args...) ->
    withMember = (member, obj, chained=false) -> 
      if _.isFunction(member)
        ret = (args...) -> member obj, args...
      else if (typeof obj == "object") and member of obj
        ret = obj[member]
        if _.isFunction(ret)
          ret = _.bind(ret, obj)
      else if (typeof obj == "object") and "_lookup" of obj
        ret = obj._lookup obj, member
      
      if ret == p.cont
      else
        type = obj._type #|| (meta obj)?.type
        if type
          ret = (polymorphic type, member)
        else if member of _ #is this last one going to far?
            ret = (args...) -> _(obj)[member] args...
        else
          ret = undefined
      if chained
        loopBack = (member) ->
          if not member
            return ret
          else 
            return withMember member, ret, true
        if _.isFunction(ret)
          (args...) ->
            ret = ret args...
            loopBack
         else
           loopBack
      else
        return ret
    [obj, member] = args
    if args.length == 1
      (member) -> withMember member, obj, true
    else
      withMember member, obj, false
    #(p listing, "save")
    #(p listing)("map")((x) -> x + 1)("select")((x) -> x == 1)()
  polymorphic.cont = "continue looking up"
  p = polymorphic
  jsonObj = (obj) ->
    ret = {}
    jsonExclusions = (p obj, "jsonExclusions") || []
    _.each obj (value, key) ->
      if key not in jsonExclusions
        if typeof value is "object"
          value = jsonObj value
        ret[key] = value
    ret




  _.extend exports, {jsonPost, jsonGet, jsonHttpMaker,
    jsonRpcMaker, meta, set, metaMaker, polymorphic,
    jsonObj}


      
       
      
  
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

  # some things like a FileList need this because _.each doesn't work
  exports.eachArray = (arr, fn) ->
    for v, k in arr
      fn v, k 
    arr
  _.mixin exports
  return exports
#root._ if root._ is defined in parent script 
