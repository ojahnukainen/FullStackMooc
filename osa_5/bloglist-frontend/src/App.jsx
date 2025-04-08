import './App.css'
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import AddBlogForm from './components/AddBlogForm'
import Toggable from './components/Toggable'

const Notifications = (props) =>{
  if(props.notification === null){
    return null
  }
  
  return(
    <div className={props.notClass}>
      <p>{props.notification}</p>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [isAuth, setIsAuth] = useState(false)
  const [notification ,setNotification] = useState(null)
  const [notficationClass, setNotificationClass] = useState(null)
  const blogFormRef = useRef()


  const handleSubmit = async (event) =>{
    event.preventDefault()
    //console.log("logged in with followin stuff", username,password)
    try{
      const userDetails = await loginService.login({username,password})
      console.log("user form handle submit",userDetails)
      blogService.setToken(userDetails.token)
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(userDetails))
      setUser(userDetails)
      setUsername('')
      setPassword('')
      setIsAuth(true)
      
    }
    catch (exp){
      console.log('no nyt joku meni vihkoon', exp)
      if(exp.response.status === 401){
        setNotification('Invalid username or password')
        setNotificationClass('errorNotification')
      }
      
      setTimeout(()=>{
        setNotification(null)
        setNotificationClass(null)
      },5000)
    }
    
  }

  const getBlogs = () => {
    blogService.getAll().then(blogsData =>{
      setBlogs( blogsData.sort((a,b)=>(b.likes-a.likes)) )
      //console.log(blogsData,"blogs")
    })  
  }

  const loginForm = () =>(
    <div>
      <h2>Sign in to see your blogs</h2>
      <Notifications notification={notification} notClass={notficationClass} />
      <form onSubmit={handleSubmit} className="signin-form">
        <label>Username</label>
        <input type="text" name="username" value={username} onChange={({target})=> setUsername(target.value)}></input>
        <label>Password</label>
        <input type="password" value={password} onChange={({target})=> setPassword(target.value)}></input>
        <button type="submit" >Login</button> 
      </form>  
    </div> 
  )
     
  const createNewBlog = ( blogObject )=>{
    
    blogFormRef.current.toggleVisibility()
    blogService
    .create(blogObject)
    .then(returnedBlog =>{
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`a new blog ${title} by ${author} has been added to collection`)
      setNotificationClass('notification')
      setTimeout(()=>{
        setNotification(null)
        setNotificationClass(null)
      },5000)
    })
    .catch((e)=>{
      console.log(e," no joku meni vihkoon,mut onko tää hyvä paikka nostaa asia esille")
    }
    )   
  }

const updateLikeCounter = async (updateObject) =>{
  try{
    await blogService.update(updateObject, updateObject.id)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a,b)=>(b.likes-a.likes)))
  }catch(e){
    console.log(e,"something went wrong while updating the like counter")
  }
}

const deleteBlog = async (deleteBlogObject) =>{
  try{
    if(window.confirm(`Are you sure you would like to delete ${deleteBlogObject.title} by ${deleteBlogObject.author}`)){

      await blogService.deleteBlog(deleteBlogObject.id)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs.sort((a,b)=>(b.likes-a.likes)))
    }
    
  }catch(e){
    console.log(e,"Something wrong while deleting")
  }
}

const renderBlogs = ()=>(
  <div className="cards">
      {
      (blogs === undefined) ? <div>There is no blogs yet</div> :
      blogs.map((blog) => 
        <Blog key={blog.id} 
          {... {blog, user, updateLikeCounter, deleteBlog}}/>
      ) 
    }
    </div> 
)


  const blogsView = () =>(
    <div>
      <div>{user.name} is signed in</div>
      <button onClick={()=>{
        window.localStorage.removeItem("loggedBlogUser") 
        setIsAuth(false)} }>log off</button>
       <Notifications notification={notification} notClass={notficationClass} />
        <Toggable buttonLabel='Add blog' ref={blogFormRef}>
          <AddBlogForm 
            submitNewBlog={createNewBlog}
          />
        </Toggable>
      
       
      <hr></hr> 
      <h2>blogs</h2>
      {renderBlogs()}
    </div>
  )

  
  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    //console.log(loggedUserJSON,"jsonia use effectust")
    if(loggedUserJSON){
      const userData = JSON.parse(loggedUserJSON)
      //console.log(JSON.parse(loggedUserJSON),"userdata from react")
      setUser(userData)
      blogService.setToken(userData.token)
      setIsAuth(true)
    }
  },[])
  useEffect(getBlogs,[isAuth])
  return (

    <div className='content'>
      <h2>Blog listing tool</h2>
        {!user && loginForm()}
        {user && blogsView()}
    </div>
  )
}

export default App