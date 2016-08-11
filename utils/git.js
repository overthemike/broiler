var which = require('shelljs').which;
var exec = require('shelljs').exec;
var error = require('./').error;
var notify = require('./').notify;
var rc = require('rc');
var didyoumean = require('didyoumean');
var Spinner = require('cli-spinner').Spinner;

module.exports = {
  getRepo: function (repo) {
    var conf = rc('broil', {});
    if (conf.repos) {
      if (conf.repos[repo]) {
        return conf.repos[repo];
      } else {
        // check to see if any are close to what was provided
        var list = Object.keys(conf.repos);
        var possible = didyoumean(repo, list);
        if (possible) {
          throw new Error(error("Did you mean '" + possible + "'?"))
        } else {
          return repo;
        }
      }
    } else {
      return repo;
    }
  },

  checkGit: function () {
    if (!which('git')) {
      throw new Error("Broiler requires git to be installed to work")
    }
  },

  validateGitRepo: function(repo, cb) {
    var gitValidateSpinner = new Spinner(notify("%s Validating git repo"))
    gitValidateSpinner.setSpinnerString(19);
    gitValidateSpinner.start();
    exec("git ls-remote " + repo, {silent:true}, function(validGitRepo){
      gitValidateSpinner.stop(true); 
      if (validGitRepo !== 0) {
        throw new Error(error("The github repo you entered is either invalid or unavailable"))
      } else {
        console.log(notify("Validated git repo"));
        cb();
      }
    });
  }
}