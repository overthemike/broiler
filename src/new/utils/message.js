import chalk from 'chalk'
import { Spinner } from 'cli-spinner'

class Message {
  

  error(msg, prefix = '>> Oops!') {
    return Array.isArray(msg) ?
      msg.join(`${chalk.cyan(`\n${prefix}`)} ${msg}`) :
      `${chalk.cyan(`${prefix}`)} ${msg}`
  }

  notify(msg, prefix = '>>') {
    return Array.isArray(msg) ?
      msg.join(`${chalk.red(`\n${prefix}`)} ${msg}`) :
      `${chalk.red(`${prefix}`)} ${msg}`
  }


}