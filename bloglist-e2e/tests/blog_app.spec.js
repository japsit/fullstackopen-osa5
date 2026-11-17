
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
    const reset = await request.post('http://localhost:3003/api/testing/reset')
    expect(reset.status()).toBe(204)

    const response = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'secret123'
      }
    })

    expect(response.ok()).toBeTruthy()

    await page.goto('http://localhost:5173/login')
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('secret123')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('Test User logged in')
      ).toBeVisible()

      await expect(page).toHaveURL('http://localhost:5173/')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('Wrong credentials')
      ).toBeVisible()

      await expect(
        page.getByRole('heading', { name: 'Log in to application' })
      ).toBeVisible()
    })
  })

  describe('When logged in', () => {

    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('secret123')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('Test User logged in')
      ).toBeVisible()
    })

    const createBlog = async (page, title) => {
      await page.getByRole('link', { name: 'create new blog' }).click()

      const inputs = page.locator('form input')

      await inputs.nth(0).fill(title)
      await inputs.nth(1).fill('Test Author')
      await inputs.nth(2).fill('https://example.com')

      await page.getByRole('button', { name: 'create', exact: true }).click()

      await expect(page).toHaveURL('http://localhost:5173/')

      await expect(
        page.getByRole('link', { name: title })
      ).toBeVisible()
    }

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright test blog')
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Blog to like')

      await page.getByRole('link', { name: 'Blog to like' }).click()

      await expect(
        page.getByText('likes 0')
      ).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(
        page.getByText('likes 1')
      ).toBeVisible()
    })

    test('creator can remove a blog', async ({ page }) => {
      await createBlog(page, 'Blog to remove')

      await page.getByRole('link', { name: 'Blog to remove' }).click()

      page.once('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page).toHaveURL('http://localhost:5173/')

      await expect(
        page.getByRole('link', { name: 'Blog to remove' })
      ).toHaveCount(0)
    })

  })
})
