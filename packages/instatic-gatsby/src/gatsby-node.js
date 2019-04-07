const path = require('path')

exports.sourceNodes = ({ actions }) => {
  actions.createTypes(`
    type Post implements Node @dontInfer(noFieldResolvers: true) {
      id: ID
      created_time: Date
      file: File
    }
  `)
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    Post: {
      file: {
        resolve (source, args, context) {
          const files = context.nodeModel.getAllNodes({ type: 'File' })

          const file = files.reduce((reduced, file) => {
            if (reduced) {
              return reduced
            }

            if (file.name === source.id) {
              return file
            }
          }, null)

          return file
        }
      }
    }
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const res = await graphql(`
    query GetPosts {
      allPost {
        edges {
          node {
            id
            created_time
            file {
              publicURL
            }
          }
        }
      }
    }
  `)

  if (res.errors) {
    throw res.errors
  }

  res.data.allPost.edges.forEach(({ node }) => {
    actions.createPage({
      component: path.resolve('./src/components/post-page.js'),
      context: {
        post: node
      },
      path: `/${node.id}`
    })
  })
}
