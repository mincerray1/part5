/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    title: 'This blog should render',
    author: 'me',
    url: 'me.com/blog',
    likes: 20
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('This blog should render me')
  expect(element).toBeDefined()
})

test('url and likes shown', async () => {
  const blog = {
    title: 'This blog should render',
    author: 'me',
    url: 'me.com/blog',
    likes: 20
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const likesElement = screen.getByText('likes: 20')
  const urlElement = screen.getByText('url: me.com/blog')
})

test('like clicked twice', async () => {
  const blog = {
    title: 'This blog should render',
    author: 'me',
    url: 'me.com/blog',
    likes: 20
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const showButton = screen.getByText('show')
  await user.click(showButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

})

test('removable', async () => {
  const blog = {
    title: 'This blog should render',
    author: 'me',
    url: 'me.com/blog',
    likes: 20
  }

  const mockHandlerHandleLike = vi.fn()
  const mockHandlerHandleRemove = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandlerHandleLike} removeBlog={mockHandlerHandleRemove} showRemove={true}/>)

  const user = userEvent.setup()
  const showButton = screen.getByText('show')
  await user.click(showButton)

  const removeButton = screen.getByText('remove')
  await user.click(removeButton)

  expect(mockHandlerHandleRemove.mock.calls).toHaveLength(1)

})

test('new blog form click create', async () => {
  const blog = {
    title: 'This blog should render',
    author: 'me',
    url: 'me.com/blog',
    likes: 20
  }

  const mockHandlerCreateBlog = vi.fn()

  render(<BlogForm createBlog={mockHandlerCreateBlog} />)
  const user = userEvent.setup()
  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], blog.title)
  await user.type(inputs[1], blog.author)
  await user.type(inputs[2], blog.url)

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(mockHandlerCreateBlog.mock.calls).toHaveLength(1)
  expect(mockHandlerCreateBlog.mock.calls[0][0].title).toBe('This blog should render')
  expect(mockHandlerCreateBlog.mock.calls[0][0].author).toBe('me')
  expect(mockHandlerCreateBlog.mock.calls[0][0].url).toBe('me.com/blog')
})