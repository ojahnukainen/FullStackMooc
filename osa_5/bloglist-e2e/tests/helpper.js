const loginWith = async( page, username, password) =>{
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', {name: 'Login'}).click()

}

const createNewBlog = async( page, title, author, url) => {
  await page.getByRole('button', {name: 'Add blog'}).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  
  await page.getByRole('button', {name: 'Add blog'}).click()
}

const createNewUser = async(request, newName, newUsername, newPassword) =>{
  await request.post('/api/users', {
          data:{
            name: newName,
            username: newUsername,
            password: newPassword
          }     
        }) 
}

export { loginWith, createNewBlog, createNewUser }