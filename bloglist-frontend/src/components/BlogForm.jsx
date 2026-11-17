
import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    const created = await createBlog({
      title,
      author,
      url
    })

    if (created) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }


  return (
    <div>
      <h2>Create new blog</h2>

      <form onSubmit={addBlog}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            label="Title"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />

          <TextField
            label="Author"
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />

          <TextField
            label="URL"
            value={url}
            onChange={event => setUrl(event.target.value)}
          />

          <Button variant="contained" type="submit">
            create
          </Button>
        </Stack>
      </form>
    </div>
  )

}

export default BlogForm
