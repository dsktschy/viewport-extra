// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/css/globals.css'],
  app: {
    head: {
      title: 'Nuxt3 Example',
      meta: [
        {
          name: 'description',
          content:
            'This example shows how to use Viewport Extra in Nuxt.js v3 application.'
        }
      ]
    }
  }
})
