_.mixin
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


# Drew LeSueur @drewlesueur
# An abstraction for calling multiple asynchronous
# functions at once, and calling a callback 
# with the "return values" of all functions
# when they are all done.
# requires underscore.js

_.mixin # underscore.js mixin
  doThese: (to_dos, callback) ->
    return_values = if _.isArray(to_dos) then [] else {}
    make_jobs_done = (id) ->
      return (ret) ->
        return_values[id] = ret
        all_done = true
        _.each to_dos, (func, id) ->
          if not(id of return_values)
            all_done = false
            #_.breakLoop()
        if all_done is true
          callback(return_values)
    _.each to_dos, (to_do, id) ->
      jobs_done = make_jobs_done(id)
      to_do(jobs_done)

