import { useEffect, useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, removeBlog, showRemove, handleLike }) => {
  const [showDetails, setShowDetails] = useState(false)

  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5
  // }

  return (
    <div className='blog'>
      {blog.title} { showDetails ? '' : blog.author } <button id="toggleDisplay" onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'hide' : 'show'}</button>
      {
        showDetails ?
          <div>
            <p>url: {blog.url}</p>
            <p>likes: {blog.likes} <button id="like" onClick={() => handleLike(blog)}>like</button></p>
            <p>author: {blog.author}</p>
            {
              showRemove ?
                <p><button id="remove" onClick={() => removeBlog(blog)}>remove</button></p>
                : ''
            }
          </div>
          : ''
      }
    </div>
  )
}

export default Blog