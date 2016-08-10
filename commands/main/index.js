var yargs = require('yargs');
var install = require('../install');
var save = require('../save');
var error = require('../../utils').error;
var didyoumean = require('didyoumean');

yargs
// Display version from package.json
.version()

// Install command
.command(
  "install", // command
  'broiler install <repo>', // description
  function (yargs) {
    install(yargs);
  }
)
.command(
  "i", 
  'alias for install',
  function (yargs) {
    install(yargs)
  }
)

// Save command
.command(
  "save", 
  'broiler save <name> <repo>', 
  function (yargs) {
    save(yargs);
  }
)
.command(
  "s", 
  'alias for save', 
  function (yargs) {
    save(yargs);
  }
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