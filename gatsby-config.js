const path = require('path')

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'Post',
        path: path.join(__dirname, 'data', 'feed.ndjson')
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'media',
        path: path.join(__dirname, 'data', 'images')
      }
    },
    'gatsby-transformer-ndjson'
  ]
}
