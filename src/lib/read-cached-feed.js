import fs from 'fs'
import fun from 'funstream'

export default function readCachedFeed (path) {
  return fun(fs.createReadStream(path, { flags: 'a+' }))
    .ndjson()
}
