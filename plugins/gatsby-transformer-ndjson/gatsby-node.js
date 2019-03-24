const fs = require('fs')
const fun = require('funstream')

exports.onCreateNode = async ({ node, actions }) => {
  if (node.extension !== `ndjson`) {
    return
  }

  await fun(fs.createReadStream(node.absolutePath))
    .ndjson()
    .forEach(item => actions.createNode({
      ...item,
      internal: {
        type: node.sourceInstanceName,
        contentDigest: item.id
      }
    }))
}
