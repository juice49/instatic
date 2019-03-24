import React from 'react'

const PostPage = ({ pageContext }) => (
  <>
    <h1>Posts</h1>
    <img src={pageContext.post.file.publicURL} />
  </>
)

export default PostPage
