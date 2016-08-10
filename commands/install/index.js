var exec = require("shelljs").exec;
var rm = require("shelljs").rm;
var error = require("../../utils").error;
var notify = require("../../utils").notify;
var semver = require("semver");
var validateNpmPackageName = require('validate-npm-package-name');
var validateLicense = require('validate-npm-package-license');
var Spinner = require('cli-spinner').Spinner;
var inquirer = require('inquirer');
var checkGit = require('../../utils/git').checkGit;
var getRepo = require('../../utils/git').getRepo;
var validateGitRepo = require('../../utils/git').validateGitRepo;
var jsonfile = require('jsonfile');

module.exports = function(yargs) {
  var repo = yargs.argv._[1];

  checkGit(); // make sure git is installed
  repo = getRepo(repo); // check if shorthand or repo
  validateGitRepo(repo); // make sure repo is valid

  const pkgInfo = [
    {
      type: 'input',
      name: 'name',
      message: 'name:',
      default: process.cwd().split('/').pop().toLowerCase(),
      validate: ( value ) => {
        var valid = validateNpmPackageName(value);
        return valid.validForNewPackages || error(valid.errors)
      }
    },
    {
      type: 'input',
      name: 'version',
      message: 'version:',
      default: '1.0.0',
      validate: function ( value ) {
        return !!semver.valid(value) || error("Invalid version: " + value);
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'description:'
    },
    {
      type: 'input',
      name: 'repository',
      message: 'git repository:'
    },
    {
      type: 'input',
      name: 'author',
      message: 'author:'
    },
    {
      type: 'input',
      name: 'license',
      message: 'license:',
      default: 'ISC',
      validate: function ( value ) {
        var valid = validateLicense(value);
        return valid.validForNewPackages || error(valid.warnings);
      }
    }
  ]

  inquirer.prompt(pkgInfo, function ( answers ) {
    // pull down repo and put into current directory
    console.log(notify("Fetching repo: " + repo))
    var gitclonespinner = new Spinner(notify("%s Cloning into " + process.cwd() + "..."))
    gitclonespinner.setSpinnerString(19);
    gitclonespinner.start();
    exec('git clone ' + repo + " " + process.cwd(), {silent:true}, function(){
      gitclonespinner.stop(true);
      console.log(notify("Cloned into " + process.cwd() + "..."));

      // preserve props to new boilerplate object
      var packageJson = jsonfile.readFileSync('package.json');
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
        }
      } else {
        delete packageJson.repository;
      }
      packageJson.author = answers.author;
      packageJson.license = answers.license;

      rm('package.json');
      jsonfile.writeFileSync('package.json', packageJson, {spaces:2});

      exec('rm -rf .git', {silent:true});
      console.log(notify("Removed boilerplate's .git directory..."));
      var npmspinner = new Spinner(notify('%s Installing NPM Modules...'));
      npmspinner.setSpinnerString(19);
      npmspinner.start();
      exec('npm install', {silent:true}, function(){
        npmspinner.stop(true);
        console.log(notify("Installed NPM Modules"));
        console.log(notify("All done!"));
      });
    });
  }); 
}