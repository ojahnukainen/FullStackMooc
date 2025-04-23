import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,

}) => {
  return(
    <div>
      <h2>Sign in to see your blogs</h2>

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

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
export default LoginForm