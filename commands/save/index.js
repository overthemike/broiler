var rc = require('rc');
var notify = require("../../utils").notify;
var getUserHome = require("../../utils").getUserHome;
var jsonfile = require("jsonfile");
var checkGit = require("../../utils/git").checkGit;
var validateGitRepo = require("../../utils/git").validateGitRepo;

module.exports = function save(name, repo, cb) {
  checkGit();

  var conf = rc('broil',{})
  
  var name = name || conf._[1];
  var repo = repo || conf._[2];

  if (!conf.config) {
    // it doesn't exist, let's create one for them in their home dir, and start over
    console.log(notify("Created file " + getUserHome() + "/.broilrc"))
    return jsonfile.writeFile(getUserHome() + "/.broilrc", {repos:{}}, {spaces:2}, function(){
      save(name, repo);
    });
  }

  validateGitRepo(repo, function(){
    var newObj = {repos:{}};
    newObj.repos[name] = repo;

    var repos = Object.assign(jsonfile.readFileSync(conf.config), newObj);

    jsonfile.writeFileSync(conf.config, repos, {spaces:2});
    
    console.log(notify('Saved!'));
    cb();
  });
}