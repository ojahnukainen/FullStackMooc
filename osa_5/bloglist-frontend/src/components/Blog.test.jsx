import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import AddBlogForm from './AddBlogForm'

const blog = {
  title: 'lol',
  url:'www.kissa.com',
  user:'Ode',
  likes: 20,
  id: 123,
}

test('renders blog title', () => {
  const user = {
    name: 'Otto',
  }
  const { container } = render(<Blog blog={blog} user={user}></Blog>)


  const subheader = container.querySelector('.cardContent')
  expect(subheader).toHaveTextContent('lol')
   /**
  const mockHandler = vi.fn()

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.cardContent')
  //expect(div).toHaveTextContent('Blog author - ')
  //screen.debug(div)

  const user = userEvent.setup()
  const button = container.querySelector('.cardButton')

  screen.debug(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(1)

  const element = screen.getAllByText('lol')
  expect(element).toBeDefined()
*/
})

test('render all blog data when button pressed', async() => {
  const mockHandler = vi.fn()
  const user = {
    name: 'Otto',
  }
  const { container } =  render(<Blog blog={blog} user={user}/>)

  const userAction = userEvent.setup()
  const button = screen.getByText('view')
  //const button = container.querySelector('.cardButton')

  screen.debug(button)
  await userAction.click(button)

  const div = container.querySelector('.cardContentOpen')
  expect(div).toHaveStyle("display: block")
})

//tehtävä 5.15
test('Add two likes to blog when pressed like button', async() => {
  const mockHandler = vi.fn()
  const user = {
    name: 'Otto',
  }

  const { container } =  render(<Blog blog={blog} user={user} updateLikeCounter={mockHandler}/>)
  const userAction = userEvent.setup()
  const view_button = screen.getByText('view')
  //const button = container.querySelector('.cardButton')

  await userAction.click(view_button)

  const like_button = screen.getByText('like')

  await userAction.click(like_button)
  await userAction.click(like_button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
//tehtävä 5.16
test('Create new blogpost state and call submit', async() => {

  const userAction = userEvent.setup()
  const createBlogpost = vi.fn()

  render(<AddBlogForm submitNewBlog={createBlogpost} />)

  const input_title = screen.getByLabelText('Title')
  const input_auth = screen.getByLabelText('Author')
  const input_url = screen.getByLabelText('URL')
  const sendButton = screen.getByText('Add blog')
  
  await userAction.type(input_title, 'Blogi Otsikko')
  await userAction.type(input_auth, 'Blogi kirjoittaja')
  await userAction.type(input_url, 'Blogi nettisivu')
  await userAction.click(sendButton)

  console.log(createBlogpost.mock.calls[0][0].author)

  expect(createBlogpost.mock.calls).toHaveLength(1)
  expect(createBlogpost.mock.calls[0][0].author).toBe('Blogi kirjoittaja')
})