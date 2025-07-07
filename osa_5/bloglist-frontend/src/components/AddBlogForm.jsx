import { useState } from 'react'

const AddBlogForm = ({ submitNewBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    submitNewBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2>Add new blog</h2>
      <form className='add-Blogs-form' onSubmit={addBlog}>
        <label>Title
          <input type="text" onChange={({ target }) => setTitle(target.value)}></input>
        </label>
        <label>Author
          <input type="text" onChange={({ target }) => setAuthor(target.value)}></input>
        </label>
        <label>URL
         <input type="text" onChange={({ target }) => setUrl(target.value)}></input>
        </label>
        <button type="submit">Add blog</button>
      </form>
    </div>

  )
}

export default AddBlogForm