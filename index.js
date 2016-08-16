var bluebird = require('bluebird');

module.exports = {
  install: bluebird.promisify(install),
  save: bluebird.promisify(save)
}
