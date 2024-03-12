import axios from 'axios'

const apiBaseURL = 'https://coder.sshtp.co'
const corsProxyURL = 'http://localhost:8080/'

const api = axios.create({
  baseURL: apiBaseURL,
})

api.interceptors.request.use((config) => {
  config.url = `${corsProxyURL}${apiBaseURL}/${config.url}`
  return config
})

export default api
