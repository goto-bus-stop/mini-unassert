#!/usr/bin/env node

if (process.argv.some(function (arg) { return /-h|--help/.test(arg) })) {
  console.log('usage: mini-unassert < inputfile.js > outputfile.js')
  process.exit(0)
}

process.stdin
  .pipe(require('.')({}))
  .pipe(process.stdout)
