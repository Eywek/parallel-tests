'use strict'

const async = require('async')
const childProcess = require('child_process')

module.exports = class Runner {
  /**
   * Init a new runner
   * @param {Array} commands List of commands to execute
   * @param {Number} number Number of commands to execute in parallel
   */
  constructor (commands, number) {
    this.commands = commands
    this.number = number
    this.startTime = 0
    this.failedTestsOutput = {}
    this.sucessfulTests = 0
    this.failedTests = 0
  }

  /**
   * Launch commands in parallel
   */
  start () {
    this.startTime = new Date()
    let i = 0

    process.stdout.write(`Running ${this.commands.length} tests:\n`)
    async.eachLimit(this.commands, this.number, (command, next) => {
      i++
      process.stdout.write('.' + (i % 30 === 0 ? '\n' : ''))
      return this.launch(command, next)
    }, (err) => {
      if (err) {
        process.stderr.write(err)
        return process.exit(1)
      }

      return this.exit()
    })
  }

  /**
   * Exit the program with exit code 0 with 100% successful tests or 1 as exit code otherwise
   * And print output from failed tests
   */
  exit () {
    // Write to stderr failed tests output
    if (this.failedTests > 0) {
      process.stdout.write('\n\n==============================\n')
      process.stderr.write(Object.keys(this.failedTestsOutput).map((test) => {
        return `--> ${test}\n\n${this.failedTestsOutput[test]}`
      }).join('\n\n==============================\n'))
    }

    // Write summary
    process.stdout.write(
      `\n\n------------------------------\n` +
      `SUCCESSFUL TESTS: ${this.sucessfulTests}\n` +
      `FAILED TESTS: ${this.failedTests}\n` +
      `Time: ${Math.ceil(Math.abs(new Date().getTime() - this.startTime.getTime()) / 1000)} secs.\n`
    )

    // Exit
    return process.exit(this.failedTests > 0)
  }

  /**
   * Execute command
   * @param {String} command Command to execute
   * @param {Function} callback Called with <err> at the end
   */
  launch (command, next) {
    childProcess.exec(command, (err, stdout, stderr) => {
      if (err) { // Failed test
        if (!err.code) {
          err.message += `(Command: ${command})`
          return next(err)
        }
        this.failedTests++
        this.addToFinalOutput(command, stdout, stderr)
        return next()
      }
      this.sucessfulTests++
      return next()
    })
  }

  /**
   * Add to final output (failed test)
   * @param {String} command Runned command
   * @param {String} stdout Stdout from the test
   * @param {String} stderr Stderr from the test
   */
  addToFinalOutput (command, stdout, stderr) {
    this.failedTestsOutput[command] = stdout || stderr
  }
}
