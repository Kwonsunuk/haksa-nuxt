// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  // ✅ Bootstrap CSS 전역 등록
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css' // 아이콘까지 쓰려면
  ],
  modules: ['@nuxt/eslint', '@nuxt/icon', '@pinia/nuxt',],
  plugins: [
    '~/plugins/fetchAdmin.client.js',
    '~/plugins/fetchMe.client.js',
  ],
  nitro: {
    devProxy: {
      '/auth/': {
        target: 'http://localhost:4000/api/',
        changeOrigin: true,
        // 요청 URL '/auth/login' → 'http://localhost:4000/api/login'
      }
    }
  }
})