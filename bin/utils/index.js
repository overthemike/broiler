"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = error;
exports.notify = notify;
exports.getUserHome = getUserHome;

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******
 * do not console.log() within the error/notify functions. There will be other uses for them
 * i.e. Spinners
 ******/

function error(msg) {
  var prefix = arguments.length <= 1 || arguments[1] === undefined ? ">> Oops!" : arguments[1];

  return Array.isArray(msg) ? msg.join(_chalk2.default.red("\n" + prefix) + " " + msg) : _chalk2.default.red("" + prefix) + " " + msg;
}

function notify(msg) {
  var prefix = arguments.length <= 1 || arguments[1] === undefined ? ">>" : arguments[1];

  return Array.isArray(msg) ? msg.join(_chalk2.default.cyan("\n" + prefix) + " " + msg) : _chalk2.default.cyan("" + prefix) + " " + msg;
}

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}