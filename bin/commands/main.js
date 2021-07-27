'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _install = require('./install');

var _install2 = _interopRequireDefault(_install);

var _save = require('./save');

var _save2 = _interopRequireDefault(_save);

var _utils = require('../utils');

var _didyoumean = require('didyoumean');

var _didyoumean2 = _interopRequireDefault(_didyoumean);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yargs2.default
// Display version from package.json
.version()

// Install command
.command('install <repo> [location]', // command
'Install a boilerplate', // description
function (_ref) {
  var repo = _ref.repo,
      location = _ref.location;

  (0, _install2.default)(repo, location);
})

// Save command
.command('save <name> <repo>', 'Save a boilerplate as an alias to use later', function (_ref2) {
  var name = _ref2.name,
      repo = _ref2.repo;

  (0, _save2.default)(name, repo);
})

// errors
.fail(function (msg, err) {
  console.log('\n', msg, err);
  if (/Unknown argument/.test(msg)) {
    var list = ['install', 'save'];
    var command = msg.split(": ")[1].split(", ")[0];
    var possible = (0, _didyoumean2.default)(command, list);
    if (possible) {
      _yargs2.default.showHelp();
      console.log((0, _utils.error)('Did you mean \'broiler ' + possible + '\'?'));
    } else {
      _yargs2.default.showHelp();
      console.log((0, _utils.error)('\'' + command + '\' is not a command that broiler understands'));
    }
  }
  process.exit(1);
}).strict()

// Help
.help("h")

// aliases for options only (not commands)
.alias("h", "help").alias("v", "version").argv;

// catch errors here
process.on('uncaughtException', function (err) {
  console.log(err);
  console.log((0, _utils.error)(err));
  process.exit(1);
});