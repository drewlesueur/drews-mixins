class AssertionError extends Error
  constructor: (options) ->
    @name = 'AssertionError'
    @message = options.message
    @actual = options.actual
    @expected = options.expected
    @operator = options.operator

  toString: () =>
    if @message
      [@name + ':', @message].join ' '
    else
      [@name + ':', JSON.stringify(@expected), @operator, JSON.stringify(@actual)].join ' '

  
assert =
  AssertionError: AssertionError
  failCount: 0
  passCount: 0
  count: 0
  fail: (actual, expected, message, operator, stackStartFunction) ->
    @failCount++
    @count++
    
    e = 
      message: message
      actual: actual
      expected: expected
      operator: operator
      stackStartFunction: stackStartFunction
    console.log e
    throw new assert.AssertionError e
  pass: (actual, expected, message, operator, stackStartFunction) ->
    @passCount++
    @count++
    
  ok: (value, message) ->
    if !!!value
      assert.fail value, true, message, '==', assert.ok
    else
      assert.pass value, true, message, "==", assert.ok
  equal: (actual, expected, message) ->
    if `actual != expected`
      assert.fail actual, expected, message, '==', assert.equal
    else
      assert.pass actual, expected, message, "==", assert.equal
  notEqual: (actual, expected, message) ->
    if `actual == expected`
      assert.fail actual, expected, message, '!=', assert.notEqual
    else
      assert.pass actual, expected, message, '!=', assert.notEqual

