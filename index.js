var through = require('through2')
var assert = require('assert')
var unassert = require('./unassert')

module.exports = function (file, opts) {
  if (typeof file === 'object' && !file._options /* is browserify object */) {
    opts = file
    file = null
  }

  assert(typeof opts === 'object', 'mini-unassert: opts must be an object')

  var src = ''
  var modules = Array.isArray(opts.modules) ? opts.modules : ['assert']

  return through(onwrite, onend)
  function onwrite (chunk, enc, next) {
    src += chunk
    next()
  }
  function onend (done) {
    this.push(unassert(src, modules))
    done()
  }
}
