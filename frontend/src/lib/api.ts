import axios from 'axios'

export const api = axios.create({
  // quero que aqui seja uma variável de ambiente
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: 'http://localhost:3000/api',
  withCredentials: true,
})

export const apiPokemon = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
})
