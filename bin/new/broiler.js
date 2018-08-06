'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _didyoumean = require('didyoumean');

var _didyoumean2 = _interopRequireDefault(_didyoumean);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _install = require('./commands/install');

var _install2 = _interopRequireDefault(_install);

var _save = require('./commands/save');

var _save2 = _interopRequireDefault(_save);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yargs2.default
// Display version from package.json
.version()

// Install command
.command({
  command: 'install <repo> [location]',
  aliases: ['install', 'i'],
  desc: 'Install a repo into location or current directory',
  handler: function handler(argv) {
    (0, _install2.default)(argv._[1], argv._[2]);
  }
})

// Save command
.command({
  command: 'save <name> <repo>',
  aliases: ['save', 's'],
  desc: 'Create an alias for a repo',
  handler: function handler(argv) {
    (0, _save2.default)();
  }
}).fail(function (msg, err) {
  // If the command isn't known, is it close to one that is?
  if (/Unknown argument/.test(msg)) {
    var list = ['install', 'save'];
    var command = msg.split(': ')[1].split(', ')[0];
    var possible = (0, _didyoumean2.default)(command, list);

    _yargs2.default.showHelp();

    if (possible) {
      console.log('Did you mean \'broiler ' + possible + '\'?');
    } else {
      console.log('\'' + command + '\' is not a command that broiler understands');
    }
  }
  process.exit(1);
}).strict()

// Help
.help('h')

// aliases for options
.alias('h', 'help').alias('v', 'version').argv;

// catch errors
process.on('uncaughtException', function (err) {
  console.log(err);
  process.exit(1);
});