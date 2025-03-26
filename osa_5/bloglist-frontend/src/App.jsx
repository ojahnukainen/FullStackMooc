import './App.css'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

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
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification ,setNotification] = useState(null)
  const [notficationClass, setNotificationClass] = useState(null)

  const handleSubmit = async (event) =>{
    event.preventDefault()
    console.log("logged in with followin stuff", username,password)
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
      setBlogs( blogsData )
      console.log(blogsData,"blogs")
    }
      
    )  
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
     
  const submitNewBlog = async (event)=>{
    event.preventDefault()

    const newBlogEntry = {
      title: title,
      author: author,
      url: url
    }
    try{
      const addDetails = await blogService.create(newBlogEntry)
      console.log(addDetails)
      setBlogs(blogs.concat(newBlogEntry))
      setNotification(`a new blog ${title} by ${author} has been added to collection`)
      setNotificationClass('notification')
      setTimeout(()=>{
        setNotification(null)
        setNotificationClass(null)
      },5000)
    }catch(e){
      console.log(e," no joku meni vihkoon,mut onko tää hyvä paikka nostaa asia esille")
    }
    
  }

  const blogsView = () =>(
    <div>
      <div>{user.name} is signed in</div>
      <button onClick={()=>{
        window.localStorage.removeItem("loggedBlogUser") 
        setIsAuth(false)} }>log off</button>
       <Notifications notification={notification} notClass={notficationClass} />
        <h2>Add new blog</h2>
          <form className='add-Blogs-form' onSubmit={submitNewBlog}>
            <label>Tittle</label>
            <input type="text" onChange={({target})=> setTitle(target.value)}></input>
            <label>Author</label>
            <input type="text" onChange={({target})=> setAuthor(target.value)}></input>
            <label>URL</label>
            <input type="text" onChange={({target})=> setUrl(target.value)}></input>
          <button type="submit">Add blog</button>
        </form>
      <hr></hr> 
      <h2>blogs</h2>
      {
        (blogs === undefined) ? <div>There is no blogs yet</div> :
        blogs.map((blog) => 
          <Blog key={blog.id} blog={blog} />
        ) 
      }
      
    </div>
  )

  
  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    console.log(loggedUserJSON,"jsonia use effectust")
    if(loggedUserJSON){
      const userData = JSON.parse(loggedUserJSON)
      console.log(JSON.parse(loggedUserJSON),"userdata from react")
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