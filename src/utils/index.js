import chalk from 'chalk'
import shell, {which, exec} from 'shelljs'
import path from 'path'
import { Spinner } from 'cli-spinner'
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

export function getPackageJsonLocations (dirname) {
  return shell.find(dirname)
    .filter(fname => {
      return !(fname.indexOf('node_modules') > -1 || fname[0] === '.') &&
        path.basename(fname) === 'package.json'
    })
    .map(fname => path.dirname(fname))
}

export function install (dir) {
  shell.cd(dir)
  const yarn = !!which('yarn')
  const npmSpinner = new Spinner(notify(`%s \u2615  - Installing NPM Modules...${yarn && '(yarn)'}`))
  npmSpinner.setSpinnerString(19)
  npmSpinner.start()

  if (!yarn) {
    exec(`npm install`, { silent: true }, () => {
      npmSpinner.stop(true)
      console.log(notify(`Installed NPM Modules in ${dir}.`))
    })
  } else {
    exec(`yarn`, { silent: true }, () => {
      npmSpinner.stop(true)
      console.log(notify(`Installed NPM Modules in ${dir}.`))
    })
  }
}



        