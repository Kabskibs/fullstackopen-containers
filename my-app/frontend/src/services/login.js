import axios from 'axios'
const backendEnv = import.meta.env.VITE_BACKEND_URL
const baseUrl = `${backendEnv}/api/login`

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default {
  login
}