// https://nuxt.com/docs/api/configuration/nuxt-config
require('dotenv').config();
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      API_KEY: process.env.API_KEY,
    },
  },
  plugins: ['~/plugins/axios.js'],
})