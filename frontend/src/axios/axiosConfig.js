import axios from 'axios'

export const cookMasterAPI = axios.create({
  baseURL: 'http://localhost:3333/',
  withCredentials: false
})
