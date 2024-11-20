import axios from 'axios'
import { logout } from '../redux/actions/authActions'
import store from '../redux/store'

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://onebill.onrender.com/api/v1', // Base URL from .env
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`https://onebill.onrender.com/api/v1/auth/refresh`, {
            refreshToken: refreshToken,
          })

          if (response.status === 200) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens

            // Update tokens in local storage
            localStorage.setItem('authToken', accessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            // Update the Authorization header and retry the original request
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError)

        // Dispatch logout action and redirect if refresh fails
        store.dispatch(logout())
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login' // Redirect to login page
      }
    }
    return Promise.reject(error)
  },
)

export default api
