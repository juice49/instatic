import mkdir from 'make-dir'
import callFn from './call-fn'

const applyConfig = (git, config) => {
  const operations = Object.keys(config).map(key => {
    return git.addConfig(key, config[key])
  })

  return Promise.all(operations)
}

export default async function fetchRepo (git, remote, repoPath, config = {}, events = {}) {
  await mkdir(repoPath)
  git.cwd(repoPath)

  if (await git.checkIsRepo()) {
    await applyConfig(git, config)
    console.log('Git pull')
    return git.pull('origin', 'master')
  }

  console.log('Git clone')
  await git.clone(remote, repoPath)

  return applyConfig(git, config)
}
