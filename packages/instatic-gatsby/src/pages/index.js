import React from 'react'
import { graphql, Link } from 'gatsby'

const IndexPage = ({ data }) => (
  <>
    <h1>Posts</h1>
    <ol>
      {data.allPost.edges.map(({ node }) => (
        <li>
          <Link to={`/${node.id}`}>{node.id}</Link>
          <img src={node.file.publicURL} />
        </li>
      ))}
    </ol>
  </>
)

export default IndexPage

export const query = graphql`
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
`
