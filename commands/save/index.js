var rc = require('rc');
var error = require("../../utils").error;
var notify = require("../../utils").notify;
var getUserHome = require("../../utils").getUserHome;
var jsonfile = require("jsonfile");
var checkGit = require("../../utils/git").checkGit;
var validateGitRepo = require("../../utils/git").validateGitRepo;

module.exports = function save(yargs) {
  checkGit();

  var conf = rc('broil',{})

  var name = conf._[1];
  var repo = conf._[2];

  validateGitRepo(repo);

  if (!conf.config) {
    // it doesn't exist, let's create one for them in their home dir, and start over
    return jsonfile.writeFile(getUserHome() + "/.broilrc", {repos:{}}, {spaces:2}, function(){
      save(yargs);
    });
  }


  var newObj = {repos:{}};
  newObj.repos[name] = repo;

  var repos = Object.assign(jsonfile.readFileSync(conf.config).repos, newObj);

  jsonfile.writeFileSync(conf.config, repos, {spaces:2});
  
  console.log(notify('Saved!'));
}