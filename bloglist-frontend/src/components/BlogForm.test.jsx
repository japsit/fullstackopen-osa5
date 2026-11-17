import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('creating a blog calls handler with correct data', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn().mockResolvedValue(true)

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], 'My test blog')
  await user.type(inputs[1], 'Test Author')
  await user.type(inputs[2], 'https://example.com')

  await user.click(
    screen.getByRole('button', { name: 'create' })
  )

  expect(createBlog).toHaveBeenCalledTimes(1)

  expect(createBlog).toHaveBeenCalledWith({
    title: 'My test blog',
    author: 'Test Author',
    url: 'https://example.com'
  })
})
