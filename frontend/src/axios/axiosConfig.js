import axios from 'axios'

export const cookMasterAPI = axios.create({
  baseURL: 'https://api.kanye.rest/',
  withCredentials: false
})
