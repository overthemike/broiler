'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRepo = getRepo;
exports.checkGit = checkGit;
exports.validateGitRepo = validateGitRepo;

var _shelljs = require('shelljs');

var _ = require('./');

var _rc = require('rc');

var _rc2 = _interopRequireDefault(_rc);

var _didyoumean = require('didyoumean');

var _didyoumean2 = _interopRequireDefault(_didyoumean);

var _cliSpinner = require('cli-spinner');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRepo(repo) {
  var conf = (0, _rc2.default)('broil', {});

  if (conf.repos) {
    if (conf.repos[repo]) {
      // if it's an exact match
      return conf.repos[repo];
    } else {
      // check to see if it's a close match
      var list = Object.keys(conf.repos);
      var possible = (0, _didyoumean2.default)(repo, list);

      if (possible) {
        // it's not a match, but it's close to one already entered in .broilrc
        throw new Error('Did you mean \'' + possible + '\'?');
      } else {
        // it doesn't match nor is it close, might be a git url
        return repo;
      }
    }
  } else {
    // just return what they typed in
    return repo;
  }
}

function checkGit() {
  if (!(0, _shelljs.which)('git')) {
    // they don't have git installed
    throw new Error("Broiler requires git to be installed to work");
  }
}

function validateGitRepo(repo, cb) {
  var spinner = new _cliSpinner.Spinner((0, _.notify)("%s Validating git repo"));
  spinner.setSpinnerString(19);
  spinner.start();
  (0, _shelljs.exec)('git ls-remote ' + repo, { silent: true }, function (code) {
    console.log('code', code);
    spinner.stop(true);
    if (code !== 0) {
      // invalid repo - https://git-scm.com/docs/git-ls-remote.html (--exit-code)
      throw new Error((0, _.error)("The github repo you entered is either invalid or unavailable"));
    } else {
      console.log((0, _.notify)("Validated git repo"));
      cb();
    }
  });
}