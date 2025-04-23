import axios from 'axios'
const baseUrl = '/api/blogs/'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}


const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  try{
    const request = await axios.get(baseUrl,config)
    //console.log(request,"get alln request")
    return request.data
  }catch(e){
    console.log('joku meni pieleen', e)
  }
}

const create = async newObject => {
  const config = {
    headers: { authorization: token },
  }
  //console.log(baseUrl, newObject, config, "kaikki mit täs nyt pitäskin lähtee")
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (updatedObject,blogID) => {
  const config = {
    headers: { authorization: token },
  }
  const res = await axios.put(`${baseUrl}${blogID}`,updatedObject,config)
  console.log(res, 'after update')
  return res.data
}

const deleteBlog = async (blogID) => {
  const config = {
    headers: { authorization: token },
  }
  console.log(`${baseUrl}${blogID}`,'deleteblog url')
  const res = await axios.delete(`${baseUrl}${blogID}`, config)
  return res.data
}

export default { getAll, create, setToken, update, deleteBlog }