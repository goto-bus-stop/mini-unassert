var test = require('tape')
var dedent = require('dedent')
var concat = require('simple-concat')
var convert = require('convert-source-map')
var unassert = require('../unassert')
var unassertify = require('..')

test('unassert', function (t) {
  t.plan(1)
  var result = unassert(dedent`
    var assert = require('assert')
    assert(true)
    assert.equal(typeof x, 'string')
    assert(sideEffectCall())
    assert.throws(function () {})
  `)

  var src = convert.removeComments(result)
  t.equal(src.trim(), dedent`
    ;
    void (true)
    void (typeof x, 'string')
    void (sideEffectCall())
    void (function () {})
  `.trim())
})

test('custom modules', function (t) {
  t.plan(1)
  var result = unassert(dedent`
    var assert = require('nanoassert')
    var assert2 = require('power-assert')
    var assert3 = require('assert')
    var assert4 = require('assert-plus')
    assert(true)
    assert2.equal(typeof x, 'string')
    assert3(1 === 1)
    assert4.throws(function () {})
  `, ['nanoassert', 'power-assert', 'assert', 'assert-plus'])

  var src = convert.removeComments(result)
  t.equal(src.trim(), dedent`
    ;
    ;
    ;
    ;
    void (true)
    void (typeof x, 'string')
    void (1 === 1)
    void (function () {})
  `.trim())
})

test('unassertify', function (t) {
  t.plan(2)
  var s = unassertify({ modules: ['xyz'] })
  concat(s, function (err, result) {
    t.ifError(err)
    var src = convert.removeComments(result.toString())
    t.equal(src.trim(), dedent`
      ;
      void (true)
      void (typeof x, 'string')
      void (sideEffectCall())
      void (function () {})
    `.trim())
  })
  s.end(dedent`
    var assert = require('xyz')
    assert(true)
    assert.equal(typeof x, 'string')
    assert(sideEffectCall())
    assert.throws(function () {})
  `)
})

test('browserify transform', function (t) {
  t.plan(2)
  var s = unassertify('/file/name.js', { modules: ['what'] })
  concat(s, function (err, result) {
    t.ifError(err)
    var src = convert.removeComments(result.toString())
    t.equal(src.trim(), dedent`
      ;
      void (true)
      void (typeof x, 'string')
      void (sideEffectCall())
      void (function () {})
    `.trim())
  })
  s.end(dedent`
    var assert = require('what')
    assert(true)
    assert.equal(typeof x, 'string')
    assert(sideEffectCall())
    assert.throws(function () {})
  `)
})

test('does not parse files without asserts', function (t) {
  t.plan(2)
  var s = unassertify({})
  var input = dedent`
    var xyz = require('lala')
    xyz.beep(boop)
    if (typeof xyz === 'function') {
      xyz(xyz)()
    }
  `
  concat(s, function (err, result) {
    t.ifError(err)
    t.equal(result.toString(), input)
  })
  s.end(input)
})
