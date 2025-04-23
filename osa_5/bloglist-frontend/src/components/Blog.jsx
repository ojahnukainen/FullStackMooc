import { useState, useEffect } from 'react'

const Blog = ({ blog, user, updateLikeCounter, deleteBlog }) => {

  const [visibility, setVisibility] = useState(true)
  const [userLikes, setUserLikes] = useState(blog.likes)
  const [isCreator, setIsCreator] = useState(false)

  const hideWhenVisible = { display: visibility ? 'none' : '' }
  const showWhenVisible = { display: visibility ? '' : 'none' }

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  const likeUpdateObject = ({
    user: blog.user,
    likes: blog.likes + 1,
    author: blog.author,
    url: blog.url,
    id: blog.id,
    title: blog.title,
  })

  const addLike = (event) => {
    event.preventDefault()
    updateLikeCounter(likeUpdateObject)
  }

  const deleteObject = ({
    user: blog.user,
    likes: blog.likes,
    author: blog.author,
    url: blog.url,
    id: blog.id,
    title: blog.title,
  })


  const handleDeleteBlog = (event) => {
    event.preventDefault()
    deleteBlog(deleteObject)
  }

  const isCreatorCheck = () => {
    if(blog.user !== undefined){
      blog.user.name === user.name ? setIsCreator(true) : null
    }
  }



  useEffect(isCreatorCheck)
  return(
    <div className="card">
      <div className="cardContent" style={showWhenVisible}>
        <div>
          <h3>
            {blog.title}
          </h3>
          <p className="contentP">Blog author - {blog.author}</p>
        </div>
        <button className="cardButton" onClick={toggleVisibility}>view</button>
      </div>
      <div className="cardContent" style={hideWhenVisible}>
        <div className="">
          <ul>
            <ol><h3>{blog.title}</h3></ol>
            <ol>Blog author - {blog.author}</ol>
            <ol>{blog.url}</ol>
            <ol>Likes {blog.likes} <button onClick={addLike}>like</button> </ol>
            <ol>{blog.user === undefined ? null: blog.user.name }</ol>
          </ul>
        </div>

        <div className="cardButtonDelete">
          <button onClick={toggleVisibility}>hide</button>
          {isCreator ? <button onClick={handleDeleteBlog}>Delete</button> : null}
        </div>
      </div>
    </div>
  )
}
export default Blog