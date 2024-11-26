const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) =>{
  const initValue = 0
  const total = blogs.reduce((acc, currentValue)=> acc + currentValue.likes, initValue)
    
  return(total)
}

const favoriteBlog = (blogs) =>{
  const initValue = 0
  let final = ""
  const total = blogs.reduce((acc, currentValue)=> (currentValue.likes > acc.likes) ? final = currentValue : final = acc)
    
  delete final._id
  delete final.__v
  delete final.url

  return(final)
  
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
} 