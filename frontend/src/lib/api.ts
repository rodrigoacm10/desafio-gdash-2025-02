import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000/api', // seu Nest com prefixo /api
  withCredentials: true, // necessário para enviar o cookie HttpOnly do refresh
})
