
import { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import BlogView from './components/BlogView'
import { TextField, Button, Stack } from '@mui/material'
import { AppBar, Toolbar, Container, Typography, Box } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      try {
        const loggedUser = JSON.parse(loggedUserJSON)
        blogService.setToken(loggedUser.token)
        setUser(loggedUser)
      } catch {
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const userData = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(userData)
      )

      blogService.setToken(userData.token)
      setUser(userData)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      showNotification('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat({
        ...newBlog,
        user: newBlog.user && typeof newBlog.user === 'object'
          ? newBlog.user
          : user
      }))

      showNotification(
        `A new blog post "${newBlog.title}" by ${newBlog.author} added`,
        'success'
      )

      navigate('/')
      return true
    } catch (error) {
      console.log(error)
      showNotification('Failed to create blog', 'error')
      return false
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: typeof blog.user === 'object'
          ? blog.user?.id
          : blog.user
      })

      setBlogs(blogs.map(b =>
        b.id === blog.id
          ? { ...updatedBlog, user: blog.user }
          : b
      ))
    } catch (error) {
      console.log(error)
      showNotification('Failed to like blog', 'error')
    }
  }

  const handleRemove = async (blog) => {
    if (!window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    )) {
      return
    }

    try {
      await blogService.remove(blog.id)

      setBlogs(blogs.filter(b => b.id !== blog.id))

      showNotification(
        `Blog "${blog.title}" removed`,
        'success'
      )
      navigate('/')
    } catch (error) {
      console.log(error)
      showNotification('Failed to remove blog', 'error')
    }
  }


  return (
    <div>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 3 }}>
            Bloglist
          </Typography>

          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>

          <Button color="inherit" component={Link} to="/login">
            login
          </Button>

          {user && (
            <>
              <Button color="inherit" component={Link} to="/create">
                create new blog
              </Button>

              <Box sx={{ flexGrow: 1 }} />

              <Typography sx={{ mr: 2 }}>
                {user.name} logged in
              </Typography>

              <Button color="inherit" onClick={handleLogout}>
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <Notification
          message={notification}
          type={notificationType}
        />

        <Routes>
          <Route path="/" element={
            <div>
              <h2>blogs</h2>

              <h3>Blog list</h3>

              {[...blogs]
                .sort((a, b) => b.likes - a.likes)
                .map(blog => (
                  <div key={blog.id}>
                    <Link to={`/blogs/${blog.id}`}>
                      {blog.title}
                    </Link>
                  </div>
                ))}
            </div>
          } />

          <Route path="/login" element={
            <div>
              <h2>Log in to application</h2>

              {user === null ? (
                <form onSubmit={handleLogin}>
                  <Stack spacing={2} sx={{ maxWidth: 350 }}>
                    <TextField
                      label="Username"
                      value={username}
                      onChange={event => setUsername(event.target.value)}
                    />

                    <TextField
                      label="Password"
                      type="password"
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                    />

                    <Button variant="contained" type="submit">
                      login
                    </Button>
                  </Stack>
                </form>
              ) : (
                <p>Already logged in</p>
              )}
            </div>
          } />
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blogs={blogs}
                user={user}
                handleLike={handleLike}
                handleRemove={handleRemove}
              />
            }
          />
          <Route
            path="/create"
            element={
              user ? (
                <BlogForm createBlog={addBlog} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Container>
    </div>
  )
}

export default App

