import chalk from 'chalk'

/******
 * do not console.log() within the error/notify functions. There will be other uses for them
 * i.e. Spinners
 ******/

export function error(msg, prefix = ">> Oops!") {
  return Array.isArray(msg) ?
    msg.join(`${chalk.red(`\n${prefix}`)} ${msg}`) :
    `${chalk.red(`${prefix}`)} ${msg}`
}

export function notify(msg, prefix = ">>") {
  return Array.isArray(msg) ?
    msg.join(`${chalk.cyan(`\n${prefix}`)} ${msg}`) :
    `${chalk.cyan(`${prefix}`)} ${msg}`
}

export function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE
}