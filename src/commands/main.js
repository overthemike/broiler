import yargs from 'yargs'
import install from './install'
import save from './save'
import { error } from '../utils'
import didyoumean from 'didyoumean'
import bluebird from 'bluebird'

yargs
// Display version from package.json
.version()

// Install command
.command(
  'install <repo> [location]', // command
  'Install a boilerplate', // description
  function ({repo, location}) {
    install(repo, location);
  }
)

// Save command
.command(
  'save <name> <repo>', 
  'Save a boilerplate as an alias to use later',
  function ({ name, repo }) {
    save(name, repo)
  }
)

// errors
.fail(function(msg, err){
  console.log('\n', msg, err)
  if (/Unknown argument/.test(msg)){
    let list = ['install', 'save'];
    let command = msg.split(": ")[1].split(", ")[0];
    let possible = didyoumean(command, list);
    if (possible) {
      yargs.showHelp();
      console.log(error(`Did you mean 'broiler ${possible}'?`));
    } else {
      yargs.showHelp();
      console.log(error(`'${command}' is not a command that broiler understands`));
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

// catch errors here
process.on('uncaughtException', function(err){
  console.log(err)
  console.log(error(err));
  process.exit(1);
})