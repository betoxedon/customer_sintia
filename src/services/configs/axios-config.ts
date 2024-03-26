import axios from 'axios'
const { VITE_FASTAPI_API } = import.meta.env

const axiosFastApi = axios.create({
   baseURL: VITE_FASTAPI_API,
})
axiosFastApi.interceptors.request.use((config) => {
   config.headers['Content-Type'] = 'application/json'
   return config
})
