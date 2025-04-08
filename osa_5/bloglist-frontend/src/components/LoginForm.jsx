  const LoginForm = ({

    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password,

    }) =>{
      return(
        <div>
          <h2>Sign in to see your blogs</h2>
          <Notifications notification={notification} notClass={notficationClass} />
          <form onSubmit={handleSubmit} className="signin-form">
            <label>Username</label>
            <input type="text" name="username" value={username} onChange={handleUsernameChange}></input>
            <label>Password</label>
            <input type="password" value={password} onChange={(handlePasswordChange)}></input>
            <button type="submit" >Login</button> 
          </form>  
        </div> 
      )
    }
export default LoginForm