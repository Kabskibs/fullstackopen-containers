import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog,
  user,
  handleAddLikes,
  handleRemoveBlog
}) => {
  const [collapsed, setCollapse] = useState(true)
  const addLikes = (event) => {
    event.preventDefault()
    handleAddLikes({
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    })
  }
  const removeBlog = (event) => {
    event.preventDefault()
    handleRemoveBlog({
      id: blog.id,
      title: blog.title,
      author: blog.author
    })
  }
  return (
    <div className="blogPostBox">
      {collapsed ? (
        <>
          <>
            {blog.title} {blog.author}
          </>
          <button onClick={ () => setCollapse(!collapsed) }>view</button>
        </>
      ) : (
        <>
          <>
            {blog.title} {blog.author}
            <button onClick={ () => setCollapse(!collapsed) }>hide</button><br></br>
          </>
          <>
            {blog.url}<br></br>
          </>
          <>
            likes {blog.likes}
            <button onClick={addLikes}>like</button><br></br>
          </>
          <>
            {blog.user.name}<br></br>
          </>
          <>
            {blog.user.username === user.username ? (
              <>
                <button onClick={removeBlog}>remove</button><br></br>
              </>
            ) : (
              <></>
            )}
          </>
        </>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleAddLikes: PropTypes.func.isRequired,
  handleRemoveBlog: PropTypes.func.isRequired
}

export default Blog