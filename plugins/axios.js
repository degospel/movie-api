import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const instance = axios.create({
    baseURL: config.public.API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.public.API_KEY}`, // or use 'x-api-key', depending on the API
    },
  })

  nuxtApp.provide('axios', instance)
})
