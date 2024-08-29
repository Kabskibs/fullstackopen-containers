import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import CreateBlog from './components/CreateBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationState, setNotificationState] = useState(0)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const refreshBlogs = () => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`Logged in as ${user.username}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotificationState(-1)
      setNotification('Wrong username or password')
      setTimeout(() => {
        setNotification(null)
        setNotificationState(0)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogUser')
    setNotification('Logged out')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleCreateBlog = (blogObject) => {
    createBlogRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        console.log(returnedBlog)
        setBlogs(blogs.concat(returnedBlog))
        refreshBlogs()
        setNotification(`Successfully added blog "${blogObject.title}" by ${blogObject.author}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const handleAddLikes = (blogObject) => {
    blogService
      .update(blogObject)
      .then(refreshBlogs)
  }

  const handleRemoveBlog = (blogObject) => {
    const confirm = window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    if (confirm) {
      blogService
        .remove(blogObject)
        .then(refreshBlogs)
      setNotification('Successfully removed blog')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <div>
      <h2>login to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Username"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const userInfo = () => (
    <div>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
    </div>
  )

  const blogsForm = () => {
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
    return (
      <div>
        <br></br>
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            handleAddLikes={handleAddLikes}
            handleRemoveBlog={handleRemoveBlog}
          />
        )}
      </div>
    )
  }

  const createBlogRef = useRef()

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} state={notificationState} />
      {!user && loginForm()}
      {user && <div>
        {userInfo()}
        <Togglable buttonLabel='new blog' ref={createBlogRef}>
          <CreateBlog handleNewBlog={handleCreateBlog} />
        </Togglable>
        {blogsForm()}
      </div>
      }
    </div>
  )
}

export default App