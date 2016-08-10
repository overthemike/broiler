var which = require('shelljs').which;
var exec = require('shelljs').exec;
var error = require('./').error;
var rc = require('rc');
var didyoumean = require('didyoumean');

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
          console.log(error("Did you mean '" + possible + "'?"))
          process.exit(1);
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
      console.log(error("Broiler requires git to be installed to work"));
      process.exit();
    }
  },

  validateGitRepo: function(repo) {
    var validGitRepo = exec("git ls-remote " + repo, {silent:true});

    if (validGitRepo.code !== 0) {
      console.log(error("The github repo you entered is either invalid or unavailable"));
      process.exit();
    }
  }
}