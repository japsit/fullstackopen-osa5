
import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '123',
    title: 'Testing React applications',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 5,
    user: {
      id: '456',
      username: 'testi',
      name: 'Test User'
    }
  }

  const loggedUser = {
    id: '456',
    username: 'testi',
    name: 'Test User'
  }

  // Tehtävä 5.13
  test('renders title and author, but hides details', () => {
    render(
      <Blog
        blog={blog}
        user={loggedUser}
        handleLike={vi.fn()}
        handleRemove={vi.fn()}
      />
    )

    expect(
      screen.getByText(/Testing React applications/)
    ).toBeVisible()

    expect(
      screen.getByText(/Test Author/)
    ).toBeVisible()

    expect(
      screen.getByRole('link', {
        name: 'https://example.com',
        hidden: true
      })
    ).not.toBeVisible()

    expect(
      screen.getByText(/likes 5/)
    ).not.toBeVisible()
  })

  // Tehtävä 5.14
  test('shows details after clicking view', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={loggedUser}
        handleLike={vi.fn()}
        handleRemove={vi.fn()}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'view' })
    )

    expect(
      screen.getByRole('link', {
        name: 'https://example.com'
      })
    ).toBeVisible()

    expect(
      screen.getByText(/likes 5/)
    ).toBeVisible()

    expect(
      screen.getByText('Test User')
    ).toBeVisible()
  })

  // Tehtävä 5.15
  test('clicking like twice calls handler twice', async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        user={loggedUser}
        handleLike={mockHandler}
        handleRemove={vi.fn()}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'view' })
    )

    const likeButton = screen.getByRole('button', {
      name: 'like'
    })

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})
