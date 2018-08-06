import yargs from 'yargs'
import didyoumean from 'didyoumean'
import bluebird from 'bluebird'
import install from './commands/install'
import save from './commands/save'
import { error } from './utils'

yargs
// Display version from package.json
.version()

// Install command
.command({
  command: 'install <repo> [location]',
  aliases: ['install', 'i'],
  desc: 'Install a repo into location or current directory',
  handler: argv => {
    install(argv._[1], argv._[2])
  }
})

// Save command
.command({
  command: 'save <name> <repo>',
  aliases: ['save', 's'],
  desc: 'Create an alias for a repo',
  handler: argv => {
    save()
  }
})

.fail((msg, err) => {
  // If the command isn't known, is it close to one that is?
  if (/Unknown argument/.test(msg)) {
    const list = ['install', 'save']
    const command = msg.split(': ')[1].split(', ')[0]
    const possible = didyoumean(command, list)

    yargs.showHelp()

    if (possible) {
      console.log(`Did you mean 'broiler ${possible}'?`)
    } else {
      console.log(`'${command}' is not a command that broiler understands`)
    }
  }
  process.exit(1)
})

.strict()

// Help
.help('h')

// aliases for options
.alias('h', 'help')
.alias('v', 'version')

.argv

// catch errors
process.on('uncaughtException', err => {
  console.log(err)
  process.exit(1)
})
