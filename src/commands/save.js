import rc from 'rc'
import { notify, getUserHome } from '../utils'
import { checkGit, validateGitRepo } from '../utils/git'
import jsonfile from 'jsonfile'

export default function save (name, repo, cb) {
  let conf = rc('broil', {})

  checkGit()

  if (!conf.config) {
    // .broilrc doesn't exist, let's create it in their home directory
    return jsonfile.writeFile(`${getUserHome()}/.broilrc`, {repos:{}}, {spaces:2}, ()=>{
      console.log(notify(`Created file ${getUserHome()}/.broilrc`))
      save(name, repo, cb)
    })
  }

  validateGitRepo(repo, () => {
    let newObj = {}
    newObj[name] = repo
  
    let repos = Object.assign(jsonfile.readFileSync(conf.config).repos, newObj)

    jsonfile.writeFileSync(conf.config, {repos}, {spaces:2})

    console.log(notify('Saved!'))
    if (cb && typeof cb === 'function') {
      cb()
    }
  })
}