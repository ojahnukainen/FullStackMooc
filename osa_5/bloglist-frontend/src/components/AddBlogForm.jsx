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
        <label>Title</label>
        <input type="text" onChange={({ target }) => setTitle(target.value)}></input>
        <label>Author</label>
        <input type="text" onChange={({ target }) => setAuthor(target.value)}></input>
        <label>URL</label>
        <input type="text" onChange={({ target }) => setUrl(target.value)}></input>
        <button type="submit">Add blog</button>
      </form>
    </div>

  )
}

export default AddBlogForm