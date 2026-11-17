
import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  const ownerId = typeof blog.user === 'object'
    ? blog.user?.id
    : blog.user

  const canRemove = user && ownerId === user.id

  return (
    <div data-testid="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      <div style={showWhenVisible}>
        <div>
          <a href={blog.url}>
            {blog.url}
          </a>
        </div>

        <div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog)}>
            like
          </button>
        </div>

        <div>
          {blog.user?.name || ''}
        </div>

        {canRemove && (
          <button onClick={() => handleRemove(blog)}>
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog
