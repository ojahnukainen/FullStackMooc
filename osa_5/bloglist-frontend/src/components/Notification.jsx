const Notification = ({ message, notClass }) => {

  if(message === null){
    return null
  }

  return(
    <div className={notClass}>
      <p>{message}</p>
    </div>
  )
}

export default Notification