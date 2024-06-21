import { useEffect, useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, removeBlog, showRemove }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(0)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
      setLikes(returnedBlog.likes)
    } catch (exception) {
      console.log(exception)
    }
  }

  useEffect(() => {
    setLikes(blog.likes)
  }, [blog.likes])

  return (
    <div style={blogStyle}>
      {blog.title} { showDetails ? '' : blog.author } <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'hide' : 'show'}</button>
      {
        showDetails ?
          <div>
            <p>url: {blog.url}</p>
            <p>likes: {likes} <button onClick={() => handleLike(blog)}>like</button></p>
            <p>author: {blog.author}</p>
            {
              showRemove ?
                <p><button onClick={() => removeBlog(blog)}>remove</button></p>
                : ''
            }
          </div>
          : ''
      }
    </div>
  )
}

export default Blog