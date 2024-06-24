import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'


const Notification = ({ message, notificationType }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={notificationType}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notificationType, setNotificationType] = useState('success')
  const [notificationMessage, setNotificationMessage] = useState(null)

  const blogFormRef = useRef()

  const setNotification = (message, type) => {
    setNotificationType(type)
    setNotificationMessage(message)

    setTimeout(() => {
      setNotificationMessage(null)
    }, 2000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('wrong credentials', 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')

      blogService.setToken('')
      setUser(null)
      setUsername('')
      setPassword('')
    } catch (exception) {
      alert(exception)
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)

      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <Notification message={notificationMessage} notificationType={notificationType}/>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )

  // const createBlog = async (event) => {
  //     event.preventDefault()

  //     const blogObject = {
  //       title: newtitle,
  //       author: newAuthor,
  //       url: newUrl
  //     }

  //     try {
  //       const returnedBlog = await blogService.create(blogObject)
  //       if (returnedBlog) {
  //         setNotification(`a new blog ${newtitle} by ${newAuthor} added`, 'success')
  //         setBlogs(blogs.concat(returnedBlog))
  //         setNewTitle('')
  //         setNewAuthor('')
  //         setNewUrl('')
  //       }
  //     } catch (exception) {
  //       setNotification('error adding new blog', 'error')
  //     }
  // }

  if (user === null) {
    return loginForm()
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
    } catch (exception) {
      setNotification(exception, 'error')
    }
  }

  const sortedBlogs = () => {
    const sorted = blogs.sort((a, b) => b.likes - a.likes)
    return sorted
  }

  const handleRemoveBlog = async (blog) => {
    try {
      if (confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(element => element.id !== blog.id))
        setNotification('blog removed', 'success')
      }
    } catch (exception) {
      setNotification(exception, 'error')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      blog.likes = returnedBlog.likes
      setBlogs(blogs.map(item => {
        if (returnedBlog.id === item.id) {
          item.likes = returnedBlog.likes
        }
        return item
      }))
    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} notificationType={notificationType}/>
      <p>{user.name} logged in</p> <form onSubmit={handleLogout}><button id="logout" type="submit">logout</button></form>

      <Togglable buttonLabel='new blog' cancelLabel='cancel' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {sortedBlogs().map(blog =>
        <Blog key={blog.id} blog={blog} removeBlog={handleRemoveBlog} showRemove={blog.user && blog.user.username === user.username} handleLike={handleLike} />
      )}
    </div>
  )
}

export default App