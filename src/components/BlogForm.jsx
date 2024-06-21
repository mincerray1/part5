import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newtitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newtitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title: <input type="text" name="title" onChange={event => setNewTitle(event.target.value)} value={newtitle} />
        </div>
        <div>
          author: <input type="text" name="author" onChange={event => setNewAuthor(event.target.value)} value={newAuthor} />
        </div>
        <div>
          url: <input type="text" name="url" onChange={event => setNewUrl(event.target.value)} value={newUrl} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm