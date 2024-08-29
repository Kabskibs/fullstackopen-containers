import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'
import { expect } from 'vitest'

test('<CreateBlog /> right information is provided to the event handler', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<CreateBlog handleNewBlog={createBlog}/>)

  const inputTitle = screen.getByPlaceholderText('blog title')
  const inputAuthor = screen.getByPlaceholderText('blog author')
  const inputUrl = screen.getByPlaceholderText('blog url')
  const buttonSend = screen.getByText('create')

  await user.type(inputTitle, 'title')
  await user.type(inputAuthor, 'author')
  await user.type(inputUrl, 'url')
  await user.click(buttonSend)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title')
  expect(createBlog.mock.calls[0][0].author).toBe('author')
  expect(createBlog.mock.calls[0][0].url).toBe('url')
})