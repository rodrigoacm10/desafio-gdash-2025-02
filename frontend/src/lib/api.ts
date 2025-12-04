import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
})

export const apiPokemon = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
})
