const { test, describe, expect, beforeEach } = require('@playwright/test');
const { loginWith, createNewBlog, createNewUser } = require('./helpper');

describe('blog app', () =>{

   beforeEach(async ({ page, request}) => {
    await page.goto('/')
    
      await request.post('api/testing/reset')
      await createNewUser(request, 'Otto J','ode','salakala')
      await createNewUser(request, 'Kissa K', 'kiskis','mau')
   })

  test('Login form is shown', async({ page })=>{
    const locator = await page.getByText('Sign in to see your blogs')
    await expect(locator).toBeVisible()
  })

//tehtävä 5.18 
  describe('login', () =>{
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'ode', 'salakala')
      await expect(page.getByText('Otto J is signed in')).toBeVisible()
    })
    
    test('fails with wrong credentials', async({ page })=>{

      await loginWith(page, 'ode', 'väärä_salakala')
      
      const errorDiv = await page.locator('.errorNotification')
      await expect(errorDiv).toContainText('Invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'groove')
      await expect(errorDiv).toHaveCSS('color', 'rgb(68, 68, 68)')

      await expect(page.getByText('Otto J is signed in')).not.toBeVisible()
    })
  })


 describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, 'ode', 'salakala')
    await createNewBlog(page, "New blog", "The writer", "www.theblog.com")
    
  })
  //tehtävä 5.19
  test('a new blog can be created', async ({ page }) => {
    const notificationDiv = await page.locator('.notification')
    await expect(notificationDiv).toHaveCSS('border-style', 'groove')
    await expect(notificationDiv).toHaveCSS('background-color', 'rgb(214, 230, 197)')
    await expect(page.getByTestId('new-added-blog')).toBeVisible()
  })

  //tehtävä 5.20
  test('add like to blog', async({ page }) => {
    await page.reload()
    await page.getByRole('button', {name: 'View'}).click()
    await page.getByRole('button', {name: 'like'}).click()
    
    await expect(page.getByText('Likes 1')).toBeVisible()
  })

  //tehtävä 5.21
  test('Delete added blog from the list', async({page}) =>{
    await page.reload()
    await page.getByRole('button', {name: 'View'}).click()
    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', {name: 'Delete'}).click()

    await expect(page.getByTestId('new-added-blog')).not.toBeVisible()
  })

  //tehtävä 5.23
  test('Blogs are acceding based on the likes', async({page }) => {
    await createNewBlog(page, "Mega blog", "Ultimate writers", "www.theultimatumblog.com")
    await page.reload()
    await createNewBlog(page, "Wildes dreams", "Mystique","mystiq.ue")
    await page.reload()

    const blog1 = page.locator('.card').filter({hasText: 'New blog'})
    const blog2 = page.locator('.card').filter({hasText: 'Mega blog'})
    const blog3 = page.locator('.card').filter({hasText: 'Wildes dreams'})
    
    await blog2.getByRole('button', {name: 'View'}).click()
    
    const blog2_like = page.locator('.card')
                            .filter({hasText: 'Mega blog'})
                            .getByRole('button', {name: 'like'})
    const blog3_like = page.locator('.card')
                            .filter({hasText: 'Wildes dreams'})
                            .getByRole('button', {name: 'like'})
    
    await blog2_like.click()
    await page.reload()
    await blog3.getByRole('button', {name: 'View'}).click()
    await blog3_like.click()

    await blog2.getByRole('button', {name: 'View'}).click()
    await blog2_like.click()
    
    await blog2_like.click()
    
  
    await expect(page.getByText('likes 2')).toBeVisible()
    await expect(page.locator('.card').first()).toContainText('Mega blog')
    await expect(page.locator('.card').last()).toContainText('New blog')
  }) 
 })

  //tehtävä 5.22
  describe('Multiple users',()=>{
    beforeEach(async({page})=>{
      await loginWith(page, 'ode', 'salakala')
      await createNewBlog(page, "New blog", "The writer", "www.theblog.com")
    })
    test('Users can delete only their own blogs',async( {page}) => {
      await page.reload()
      await page.getByRole('button', {name: 'View'}).click()
      await page.getByRole('button', {name: 'like'}).click()

      await page.getByRole('button', {name: 'log off'}).click()
      await page.reload()

      await loginWith(page, 'kiskis', 'mau')

      await page.getByRole('button', {name: 'View'}).click()

      await expect(page.getByRole('button', {name: 'Delete'})).not.toBeVisible()
    })

  })

})
