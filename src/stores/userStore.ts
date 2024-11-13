import { defineStore } from 'pinia'

interface UserInfo {
  userId: string | null
  mistralAPIKey: string
}

export const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    userId: null,
    mistralAPIKey: '',
  }),

  actions: {
    setMistralAPIKey(value: string) {
      this.mistralAPIKey = value
      if (this.userId) {
        localStorage.setItem(`mistralAPIKey-${this.userId}`, value)
      }
    },

    loadMistralAPIKey() {
      if (this.userId) {
        const storedValue = localStorage.getItem(`mistralAPIKey-${this.userId}`)
        this.mistralAPIKey = storedValue !== null ? storedValue : ''
      }
    },

    init(userId: string) {
      this.userId = userId
      this.loadMistralAPIKey()
    },

    logout() {
      this.userId = null
      this.mistralAPIKey = ''
    },

    clearUserData() {
      if (this.userId) {
        localStorage.removeItem(`mistralAPIKey-${this.userId}`)
      }
      this.userId = null
      this.mistralAPIKey = ''
    },
  },
})
