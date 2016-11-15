var bluebird = require('bluebird')
var install = require('./bin/commands/install')
var save = require('./bin/commands/save')

console.log(install)

module.exports = {
  install: bluebird.promisify(install),
  save: bluebird.promisify(save)
}
