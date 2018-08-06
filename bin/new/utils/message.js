'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _cliSpinner = require('cli-spinner');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Message = function () {
  function Message() {
    _classCallCheck(this, Message);
  }

  _createClass(Message, [{
    key: 'error',
    value: function error(msg) {
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '>> Oops!';

      return Array.isArray(msg) ? msg.join(_chalk2.default.cyan('\n' + prefix) + ' ' + msg) : _chalk2.default.cyan('' + prefix) + ' ' + msg;
    }
  }, {
    key: 'notify',
    value: function notify(msg) {
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '>>';

      return Array.isArray(msg) ? msg.join(_chalk2.default.red('\n' + prefix) + ' ' + msg) : _chalk2.default.red('' + prefix) + ' ' + msg;
    }
  }]);

  return Message;
}();