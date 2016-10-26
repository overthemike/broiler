import { which, exec, rm } from 'shelljs'
import { error, notify } from '../utils'
import semver from 'semver'
import validateNpmPackageName from 'validate-npm-package-name'
import validateLicense from 'validate-npm-package-license'
import { Spinner } from 'cli-spinner'
import inquirer from 'inquirer'
import { checkGit, getRepo, validateGitRepo } from '../utils/git'
import jsonfile from 'jsonfile'
import extfs from 'extfs'
import fs from 'fs'

const currentDir = process.cwd()

export default function (repo, location = currentDir, cb) {
  if (location !== currentDir) {
    location = `${currentDir}/${location}`
  }

  let isNewDir = false;

  // check if location exists; if not, create it
  try {
    fs.statSync(location)
  } catch (err) {
    isNewDir = true
    fs.mkdirSync(location)
  }

  if (!extfs.isEmptySync(location)) {
    throw new Error(error(`The location you're installing to isn't empty...`))
  }

  checkGit() // make sure git is installed

  repo = getRepo(repo)

  validateGitRepo(repo, function(){
    const pkgInfo = [
      {
        type: 'input',
        name: 'name',
        message: 'name:',
        default: location.split('/').pop().toLowerCase(),
        validate: ( value ) => {
          var valid = validateNpmPackageName(value);
          return valid.validForNewPackages || error(valid.errors, 'Oops!')
        }
      },
      {
        type: 'input',
        name: 'version',
        message: 'version:',
        default: '1.0.0',
        validate: function ( value ) {
          return !!semver.valid(value) || error("Invalid version: " + value, 'Oops!');
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'description:'
      },
      {
        type: 'input',
        name: 'repository',
        message: 'git repository:'
      },
      {
        type: 'input',
        name: 'author',
        message: 'author:'
      },
      {
        type: 'input',
        name: 'license',
        message: 'license:',
        default: 'ISC',
        validate: function ( value ) {
          var valid = validateLicense(value);
          return valid.validForNewPackages || error(valid.warnings, 'Oops!');
        }
      }
    ]

    inquirer.prompt(pkgInfo, ( answers ) => {
      // pull down repo and put into current directory
      console.log(notify(`Repo: ${repo}`))
      
      let cloneSpinner = new Spinner(notify(`%s Cloning into ${location}...`))
      cloneSpinner.setSpinnerString(19)
      cloneSpinner.start()

      exec(`git clone ${repo} ${location}`, { silent: true }, () => {
        cloneSpinner.stop(true)
        console.log(notify(`Cloned into ${location}`))

        // do package.json meddling
        let packageJson = jsonfile.readFileSync(`${location}/package.json`)

        packageJson.boilerplate = {
          name: packageJson.name,
          version: packageJson.version,
          description: packageJson.description,
          repository: packageJson.repository,
          author: packageJson.author,
          license: packageJson.license
        }

        packageJson.name = answers.name;
        packageJson.version = answers.version;
        packageJson.description = answers.description;
        if (answers.repository) {
          packageJson.repository = {
            type: 'git',
            url: answers.repository
          }
        } else {
          delete packageJson.repository;
        }
        packageJson.author = answers.author;
        packageJson.license = answers.license;

        rm(`${location}/package.json`)
        jsonfile.writeFileSync(`${location}/package.json`, packageJson, { spaces: 2 })
      
        // remove old git repo
        exec(`cd ${location} && rm -rf .git`, { silent: true })
        console.log(notify('Removed boilerplate .git directory'))

        // install npm modules
        let npmSpinner = new Spinner(notify('%s \u2615  - Installing NPM Modules...'))
        npmSpinner.setSpinnerString(19)
        npmSpinner.start()

        if (!which('yarn')) {
          exec(`cd ${location} && npm install`, { silent: true }, () => {
            npmSpinner.stop(true)
            console.log(notify('Installed NPM Modules.'))
            console.log(notify('All done!'))

            if (cb && typeof cb === 'function') {
              cb()
            }
          })
        } else {
          exec(`cd ${location} && yarn`, { silent: true }, () => {
            npmSpinner.stop(true)
            console.log(notify('Installed NPM Modules.'))
            console.log(notify('All done!'))

            if (cb && typeof cb === 'function') {
              cb()
            }
          })
        }
      })
    })
  })
}