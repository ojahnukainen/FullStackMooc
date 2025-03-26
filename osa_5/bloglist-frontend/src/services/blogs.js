import axios from 'axios'
const baseUrl = '/api/blogs/'


let token = null

const setToken = newToken =>{
  token = `Bearer ${newToken}`
}


const getAll = async () => {
  const config = {
    headers: {Authorization: token},
  }
  try{
    const request = await axios.get(baseUrl,config)
    
    return request.data
  }catch(e){
    console.log("joku meni pieleen", e)
  }
}

const create = async newObject =>{
  const config = {
    headers: {authorization: token},
  }
  console.log(baseUrl, newObject, config, "kaikki mit täs nyt pitäskin lähtee")
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, setToken}