var bluebird = require('bluebird');
var install = require('./commands/install');
var save = require('./commands/save');

module.exports = {
  install: bluebird.promisify(install),
  save: bluebird.promisify(save)
}
