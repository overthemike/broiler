'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (repo) {
  var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : currentDir;

  if (location !== currentDir) {
    location = currentDir + '/' + location;
  }

  var isNewDir = false;

  // check if location exists; if not, create it
  try {
    _fs2.default.statSync(location);
  } catch (err) {
    isNewDir = true;
    _fs2.default.mkdirSync(location);
  }

  if (!_extfs2.default.isEmptySync(location)) {
    throw new Error((0, _utils.error)('The location you\'re installing to isn\'t empty...'));
  }

  (0, _git.checkGit)(); // make sure git is installed

  repo = (0, _git.getRepo)(repo);

  (0, _git.validateGitRepo)(repo, function () {
    var pkgInfo = [{
      type: 'input',
      name: 'name',
      message: 'name:',
      default: location.split('/').pop().toLowerCase(),
      validate: function validate(value) {
        var valid = (0, _validateNpmPackageName2.default)(value);
        return valid.validForNewPackages || (0, _utils.error)(valid.errors, 'Oops!');
      }
    }, {
      type: 'input',
      name: 'version',
      message: 'version:',
      default: '1.0.0',
      validate: function validate(value) {
        return !!_semver2.default.valid(value) || (0, _utils.error)("Invalid version: " + value, 'Oops!');
      }
    }, {
      type: 'input',
      name: 'description',
      message: 'description:'
    }, {
      type: 'input',
      name: 'repository',
      message: 'git repository:'
    }, {
      type: 'input',
      name: 'author',
      message: 'author:'
    }, {
      type: 'input',
      name: 'license',
      message: 'license:',
      default: 'ISC',
      validate: function validate(value) {
        var valid = (0, _validateNpmPackageLicense2.default)(value);
        return valid.validForNewPackages || (0, _utils.error)(valid.warnings, 'Oops!');
      }
    }];

    _inquirer2.default.prompt(pkgInfo, function (answers) {
      // pull down repo and put into current directory
      console.log((0, _utils.notify)('Repo: ' + repo));

      var cloneSpinner = new _cliSpinner.Spinner((0, _utils.notify)('%s Cloning into ' + location + '...'));
      cloneSpinner.setSpinnerString(19);
      cloneSpinner.start();

      (0, _shelljs.exec)('git clone ' + repo + ' ' + escape(location), { silent: true }, function () {
        cloneSpinner.stop(true);
        console.log((0, _utils.notify)('Cloned into ' + location));

        // do main package.json meddling
        var packageJson = _jsonfile2.default.readFileSync(escape(location) + '/package.json');

        packageJson.boilerplate = {
          name: packageJson.name,
          version: packageJson.version,
          description: packageJson.description,
          repository: packageJson.repository,
          author: packageJson.author,
          license: packageJson.license
        };

        packageJson.name = answers.name;
        packageJson.version = answers.version;
        packageJson.description = answers.description;
        if (answers.repository) {
          packageJson.repository = {
            type: 'git',
            url: answers.repository
          };
        } else {
          delete packageJson.repository;
        }
        packageJson.author = answers.author;
        packageJson.license = answers.license;

        (0, _shelljs.rm)(location + '/package.json');
        _jsonfile2.default.writeFileSync(location + '/package.json', packageJson, { spaces: 2 });

        // remove old git repo
        (0, _shelljs.exec)('cd ' + escape(location) + ' && rm -rf .git', { silent: true });
        console.log((0, _utils.notify)('Removed boilerplate .git directory'));

        // install npm modules
        (0, _utils.getPackageJsonLocations)(escape(location)).map(_utils.install);
      });
    });
  });
};

var _shelljs = require('shelljs');

var _utils = require('../utils');

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _validateNpmPackageName = require('validate-npm-package-name');

var _validateNpmPackageName2 = _interopRequireDefault(_validateNpmPackageName);

var _validateNpmPackageLicense = require('validate-npm-package-license');

var _validateNpmPackageLicense2 = _interopRequireDefault(_validateNpmPackageLicense);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _git = require('../utils/git');

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _extfs = require('extfs');

var _extfs2 = _interopRequireDefault(_extfs);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cliSpinner = require('cli-spinner');

var _shellEscape = require('shell-escape');

var _shellEscape2 = _interopRequireDefault(_shellEscape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentDir = process.cwd();

function escape(item) {
  if (Array.isArray(item)) {
    return (0, _shellEscape2.default)(item);
  } else {
    return (0, _shellEscape2.default)([item]);
  }
}