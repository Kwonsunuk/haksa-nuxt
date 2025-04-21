// stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    me: null,
  }),
  actions: {
    login(userInfo) {
      this.me = userInfo
    },
    logout() {
      this.me = null
    },
  },
})
