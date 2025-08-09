// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/css/globals.css'],
  app: {
    head: {
      title: 'Usage Examples in Nuxt Application',
      meta: [
        {
          name: 'description',
          content:
            'This example shows how to use Viewport Extra in a Nuxt.js v3 application.'
        }
      ]
    }
  }
})
