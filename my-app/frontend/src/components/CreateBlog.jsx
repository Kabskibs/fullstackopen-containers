import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlog = ({
  handleNewBlog
}) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const resetNewBlog = () => {
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }
  const createNewBlog = (event) => {
    event.preventDefault()
    handleNewBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    })
    resetNewBlog()
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createNewBlog}>
        <div>
          title:
          <input
            type="text"
            value={blogTitle}
            name="blogTitle"
            onChange={event => setBlogTitle(event.target.value)}
            placeholder='blog title'
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={blogAuthor}
            name="blogAuthor"
            onChange={event => setBlogAuthor(event.target.value)}
            placeholder='blog author'
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={blogUrl}
            name="blogUrl"
            onChange={event => setBlogUrl(event.target.value)}
            placeholder='blog url'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

CreateBlog.propTypes = {
  handleNewBlog: PropTypes.func.isRequired
}

export default CreateBlog