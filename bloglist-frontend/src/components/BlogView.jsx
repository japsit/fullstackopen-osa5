
import { useParams } from 'react-router-dom'
import {
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  Link,
  Chip
} from '@mui/material'

const BlogView = ({ blogs, user, handleLike, handleRemove }) => {
  const { id } = useParams()
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const ownerId = typeof blog.user === 'object'
    ? blog.user?.id
    : blog.user

  const canRemove = Boolean(user?.id && ownerId && ownerId === user.id)

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 700 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4">
            {blog.title}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            {blog.author}
          </Typography>
        </Box>

        <Link href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </Link>

        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={`${blog.likes} likes`}
              color="primary"
              variant="outlined"
            />

            {user && (
              <Button
                variant="contained"
                onClick={() => handleLike(blog)}
              >
                like
              </Button>
            )}
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary">
          added by {blog.user?.name || ''}
        </Typography>

        {canRemove && (
          <Box>
            <Button
              color="error"
              variant="outlined"
              onClick={() => handleRemove(blog)}
            >
              remove
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  )
}

export default BlogView
