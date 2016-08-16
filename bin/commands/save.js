'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = save;

var _rc = require('rc');

var _rc2 = _interopRequireDefault(_rc);

var _utils = require('../utils');

var _git = require('../utils/git');

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function save(name, repo, cb) {
  (0, _git.checkGit)();

  var conf = (0, _rc2.default)('broil', {});

  name = name || conf._[1];
  repo = repo || conf._[2];

  if (!conf.config) {
    // .broilrc doesn't exist, let's create it in their home directory
    return _jsonfile2.default.writeFile((0, _utils.getUserHome)() + '/.broilrc', { repos: {} }, { spaces: 2 }, function () {
      console.log((0, _utils.notify)('Created file ' + (0, _utils.getUserHome)() + '/.broilrc'));
      save(name, repo, cb);
    });
  }

  (0, _git.validateGitRepo)(repo, function () {
    var newObj = { repos: {} };
    newObj.repos[name] = repo;

    var repos = Object.assign(_jsonfile2.default.readFileSync(conf.config), newObj);

    _jsonfile2.default.writeFileSync(conf.config, repos, { spaces: 2 });

    console.log((0, _utils.notify)('Saved!'));
    if (cb && typeof cb === 'function') {
      cb();
    }
  });
}