import { which, exec } from 'shelljs'
import { error, notify } from './'
import rc from 'rc'
import didyoumean from 'didyoumean'
import { Spinner } from 'cli-spinner'

export function getRepo(repo) {
  const conf = rc('broil', {})

  if (conf.repos) {
    if (conf.repos[repo]) { // if it's an exact match
      return conf.repos[repo]
    } else {
      // check to see if it's a close match
      let list = Object.keys(conf.repos)
      let possible = didyoumean(repo, list)

      if (possible) {
        // it's not a match, but it's close to one already entered in .broilrc
        throw new Error(error(`Did you mean '${possible}'?`))
      } else {
        // it doesn't match nor is it close, might be a git url
        return repo
      }
    }
  } else {
    // just return what they typed in
    return repo
  }
}

export function checkGit() {
  if (!which('git')) {
    // they don't have git installed
    throw new Error("Broiler requires git to be installed to work")
  }
}

export function validateGitRepo(repo, cb) {
  let spinner = new Spinner(notify("%s Validating git repo"))
  spinner.setSpinnerString(19)
  spinner.start()
  exec(`git ls-remote ${repo}`, { silent: true }, function(code) {
    spinner.stop(true)
    if (code !== 0) { // invalid repo - https://git-scm.com/docs/git-ls-remote.html (--exit-code)
      throw new Error(error("The github repo you entered is either invalid or unavailable"))
    } else {
      console.log(notify("Validated git repo"))
      cb()
    }
  })
}