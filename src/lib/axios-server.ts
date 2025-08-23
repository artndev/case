import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
  withCredentials: true,
  headers: {
    'X-Api-Key': process.env.X_API_KEY,
    'Content-Type': 'application/json',
  },
})

export default instance
