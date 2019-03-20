import fs from 'fs'
import path from 'path'
import got from 'got'
import get from 'lodash.get'
import fun from 'funstream'
import callFn from './call-fn'

const fetchImage = imagesPath => async function fetchImage (item, events = {}) {
  const url = get(item, 'images.standard_resolution.url')
  const basename = `${item.id}.jpg`
  const writePath = path.join(imagesPath, basename)
  const fetcher = got.stream(url)
  const writer = fs.createWriteStream(writePath, { flags: 'wx' })

  writer.on('error', error => {
    if (error.code === 'EEXIST') {
      callFn(events.skipExistingImage, basename)
      return
    }

    throw error
  })

  callFn(events.preFetchImage, basename)
  fetcher.pipe(writer)
  await fun(writer)
}

export default fetchImage
