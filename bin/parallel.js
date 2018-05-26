#!/usr/bin/env node
'use strict'

const yargs = require('yargs')
const Runner = require('../src/run')

yargs // eslint-disable-line
  .usage('$0 [opts] <commands> [opts]')
  .option('number', {
    alias: 'n',
    default: 4,
    describe: 'how many tests you want to run in parallel'
  })
  .command('<commands>')
  .example('$0 "mocha test.js" "mocha test2.js"', 'Execute test in parallel')
  .demandCommand(1)
  .argv

new Runner(yargs.argv._, yargs.argv.number).start()
