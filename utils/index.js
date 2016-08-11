var chalk = require("chalk");
// do not console.log() within the error/notify functions. There will be other uses for them
// i.e. Spinners

module.exports = {
  error: function(msg) {
    return Array.isArray(msg) ? msg.join(chalk.red("\n>> Oops! ")) : chalk.red(">> Oops! ") + msg;
  },
  generr: function(msg){
    return Array.isArray(msg) ? msg.join(chalk.red("\nOops! ")) : chalk.red("Oops! ") + msg;
  },
  notify: function (msg) {
    return Array.isArray(msg) ? msg.join(chalk.cyan("\n>> ")) : chalk.cyan(">> ") + msg;
  },
  getUserHome: function() {
    return process.env.HOME || process.env.USERPROFILE;
  }
}