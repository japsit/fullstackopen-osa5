
import { test, expect, describe, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BlogView from './BlogView'

describe('BlogView', () => {
  const blog = {
    id: '123',
    title: 'Test blog',
    author: 'Juha',
    url: 'https://example.com',
    likes: 5,
    user: {
      id: '456',
      name: 'Juha'
    }
  }

  const renderBlog = (user) => {
    render(
      <MemoryRouter initialEntries={['/blogs/123']}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blogs={[blog]}
                user={user}
                handleLike={vi.fn()}
                handleRemove={vi.fn()}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )
  }

  test('blog details are shown when not logged in', () => {
    renderBlog(null)

    expect(screen.getByText('Test blog Juha')).toBeVisible()
    expect(screen.getByText('likes 5')).toBeVisible()
    expect(screen.getByText('https://example.com')).toBeVisible()

    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('logged in user can like but not remove other blogs', () => {
    renderBlog({
      id: '789',
      name: 'Other User'
    })

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('blog creator can also remove the blog', () => {
    renderBlog({
      id: '456',
      name: 'Juha'
    })

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
  })
})
