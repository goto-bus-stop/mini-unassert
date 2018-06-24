# mini-unassert

a small and fast unassert transform

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

It transforms `assert` calls to `void` expressions. Use a minifier like [terser](https://github.com/fabiosantoscode/terser) to completely remove them.

Input:

```js
var assert = require('assert')
assert(true)
assert.equal(typeof x, 'string')
assert(sideEffectCall())
assert.throws(function () {})
```

Output:

```js
;
void (true)
void (typeof x, 'string')
void (sideEffectCall())
void (function () {})
```

After minification:

```js
sideEffectCall();
```

[npm-image]: https://img.shields.io/npm/v/mini-unassert.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/mini-unassert
[travis-image]: https://img.shields.io/travis/goto-bus-stop/mini-unassert.svg?style=flat-square
[travis-url]: https://travis-ci.org/goto-bus-stop/mini-unassert
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install mini-unassert
```

## Usage

It works as a stream and as a browserify transform.

```js
var unassert = require('mini-unassert')
fs.createReadStream('file.js')
  .pipe(unassert({ modules: ['assert', 'power-assert', 'nanoassert'] }))
  .pipe(fs.createWriteStream('file.unassert.js'))
```

```js
browserify -g mini-unassert -g uglifyify
```

## API

### `stream = unassert(opts={})`

Create a stream that replaces assert calls with `void` expressions.

* `opts.modules` is an array of assertion module names, defaulting to `['assert']`.

### `b.transform(unassert, opts={})`

Add `unassert` as a browserify transform. `b` is an instance of browserify.

* Set `opts.global` to run it on all files, including dependencies in node_modules. (recommended)
* `opts.modules` is an array of assertion module names, defaulting to `['assert']`.

## License

[Apache-2.0](LICENSE.md)
