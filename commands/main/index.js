var yargs = require('yargs');
var install = require('../install');
var save = require('../save');
var error = require('../../utils').error;
var didyoumean = require('didyoumean');
var bluebird = require('bluebird');

yargs
// Display version from package.json
.version()

// Install command
.command(
  "install", // command
  'broiler install <repo> [<location>]', // description
  function (yargs) {
    install(yargs.argv._[1], yargs.argv._[2]);
  }
)
.command(
  "i", 
  'alias for install',
  function (yargs) {
    install(yargs.argv._[1], yargs.argv._[2])
  }
)

// Save command
.command(
  "save", 
  'broiler save <name> <repo>',
  save
)
.command(
  "s", 
  'alias for save',
  save
)

// errors
.fail(function(msg, err){
  if (/Unknown argument/.test(msg)){
    var list = ['install', 'save'];
    var command = msg.split(": ")[1].split(", ")[0];
    var possible = didyoumean(command, list);
    if (possible) {
      yargs.showHelp();
      console.log(error("Did you mean 'broiler " + possible + "'?"));
    } else {
      yargs.showHelp();
      console.log(error("'" + command + "' is not a command that broiler understands"));
    }
  }
  process.exit(1)
})
.strict()

// Help
.help("h")

// aliases for options only (not commands)
.alias("h", "help")
.alias("v", "version")

.argv

module.exports = {
  install: bluebird.promisify(install),
  save: bluebird.promisify(save)
}


// catch errors here
process.on('uncaughtException', function(err){
  console.log(error(err));
  process.exit(1);
})