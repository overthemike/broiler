'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = error;
exports.notify = notify;
exports.getUserHome = getUserHome;
exports.getPackageJsonLocations = getPackageJsonLocations;
exports.install = install;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cliSpinner = require('cli-spinner');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******
 * do not console.log() within the error/notify functions. There will be other uses for them
 * i.e. Spinners
 ******/

function error(msg) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ">> Oops!";

  return Array.isArray(msg) ? msg.join(_chalk2.default.red('\n' + prefix) + ' ' + msg) : _chalk2.default.red('' + prefix) + ' ' + msg;
}

function notify(msg) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ">>";

  return Array.isArray(msg) ? msg.join(_chalk2.default.cyan('\n' + prefix) + ' ' + msg) : _chalk2.default.cyan('' + prefix) + ' ' + msg;
}

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

function getPackageJsonLocations(dirname) {
  return _shelljs2.default.find(dirname).filter(function (fname) {
    return !(fname.indexOf('node_modules') > -1 || fname[0] === '.') && _path2.default.basename(fname) === 'package.json';
  }).map(function (fname) {
    return _path2.default.dirname(fname);
  });
}

function install(dir) {
  _shelljs2.default.cd(dir);
  var yarn = !!(0, _shelljs.which)('yarn');
  var npmSpinner = new _cliSpinner.Spinner(notify('%s \u2615  - Installing NPM Modules...' + (yarn && '(yarn)')));
  npmSpinner.setSpinnerString(19);
  npmSpinner.start();

  if (!yarn) {
    (0, _shelljs.exec)('npm install', { silent: true }, function () {
      npmSpinner.stop(true);
      console.log(notify('Installed NPM Modules in ' + dir + '.'));
    });
  } else {
    (0, _shelljs.exec)('yarn', { silent: true }, function () {
      npmSpinner.stop(true);
      console.log(notify('Installed NPM Modules in ' + dir + '.'));
    });
  }
}