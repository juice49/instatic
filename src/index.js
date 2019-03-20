import 'core-js/modules/es7.symbol.async-iterator'

import { config as dotenv } from 'dotenv'
dotenv()

import { tmpdir } from 'os'
import { parse } from 'url'
import qs from 'querystring'
import fs from 'fs-extra'
import path from 'path'
import mkdir from 'make-dir'
import ndjson from 'ndjson'
import pThrottle from 'p-throttle'
import pathExists from 'path-exists'
import installGit from 'lambda-git'
import createJwtAuth from 'micro-jwt-auth'
import gitClient from 'simple-git/promise'
import ensureEnv from './lib/ensure-env'
import readCachedFeed from './lib/read-cached-feed'
import fetchRepo from './lib/fetch-repo'
import fetchFeed from './lib/fetch-feed'
import fetchImage from './lib/fetch-image'

ensureEnv([
  'GIT_USER_NAME',
  'GIT_USER_EMAIL',
  'GIT_REMOTE',
  'INSTAGRAM_TOKEN',
  'JWT_SECRET'
])

const auth = createJwtAuth(process.env.JWT_SECRET)

const preFetchPage = page =>
  console.log('Fetch feed page:', page)

const preFetchImage = basename =>
  console.log('Fetch image:', basename)

export default auth(async (req, res) => {
  const url = parse(req.url)
  const params = qs.decode(url.query)
  const reset = typeof params.reset !== 'undefined'

  if (process.env.NOW_REGION) {
    console.log('Install git')
    await installGit()
  }

  await run(reset)
  res.end('Done')
})

async function run (reset = false) {
  const repoPath = path.join(tmpdir(), 'instagram')
  const outputPath = path.join(repoPath, 'data')
  const git = gitClient()

  console.log('Repo path:', repoPath)

  await fetchRepo(git, process.env.GIT_REMOTE, repoPath, {
    'user.name': process.env.GIT_USER_NAME,
    'user.email': process.env.GIT_USER_EMAIL
  })

  await fetch(reset)

  console.log('Git add')
  await git.add(outputPath)

  console.log('Git commit')
  await git.commit(':robot: Update Instagram')

  console.log('Git push')
  await git.push('origin', 'master')

  console.log('Done')
}

async function fetch (reset = false) {
  const feedPath = path.join(outputPath, `feed.ndjson`)

  await mkdir(outputPath)

  const latest = await readCachedFeed(feedPath)
    .head(1)
    .reduce((reduced, item) => item)

  const postedAfter = !reset && latest && latest.id

  try {
    // For an incremental fetch, insert entries into a new file.
    const writeFeedPath = postedAfter
      ? path.join(outputPath, `feed-${(new Date()).getTime()}.ndjson`)
      : feedPath

    const writer = fs.createWriteStream(writeFeedPath)
    const serializer = ndjson.serialize()

    serializer.pipe(writer)

    for await (const item of fetchFeed(process.env.INSTAGRAM_TOKEN, postedAfter, { preFetchPage })) {
      serializer.write(item)
    }

    if (postedAfter) {
      await readCachedFeed(feedPath)
        .pipe(serializer)

      await fs.unlink(feedPath)
      await fs.rename(writeFeedPath, feedPath)
    }

    serializer.end()
  } catch (error) {
    console.log(error)
    return
  }

  const imagesPath = path.join(outputPath, 'images')
  await mkdir(imagesPath)

  try {
    const fetchImageThrottled = pThrottle(fetchImage(imagesPath), 5, 1000)

    await readCachedFeed(feedPath)
      .forEach(async item => {
        const basename = `${item.id}.jpg`
        const writePath = path.join(imagesPath, basename)
        const exists = await pathExists(writePath)

        if (exists) {
          return
        }

        await fetchImageThrottled(item, { preFetchImage })
      })
  } catch (error) {
    console.log(error)
  }
}
