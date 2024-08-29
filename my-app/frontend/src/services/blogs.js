import axios from 'axios'
const backendEnv = import.meta.env.VITE_BACKEND_URL
const baseUrl = `${backendEnv}/api/blogs`

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async newObject => {
  return await axios.put(`${baseUrl}/${newObject.id}`, newObject)
}

const remove = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${newObject.id}`, config, newObject)
  return response.data
}

export default {
  getAll,
  create,
  setToken,
  update,
  remove
}