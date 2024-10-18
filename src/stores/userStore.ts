import { defineStore } from 'pinia'

interface UserInfo {
  authToken: string
  mistralAPIKey: string
}

export const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    authToken: '',
    mistralAPIKey: '',
  }),

  actions: {
    setAuthToken(token: string) {
      this.authToken = token
      // Explicitly save to sessionStorage since we're using it for persistence
      sessionStorage.setItem('authToken', token)
    },

    setMistralAPIKey(value: string) {
      this.mistralAPIKey = value
      localStorage.setItem('mistralAPIKey', value)
    },

    clearAuthToken() {
      this.authToken = ''
      // Also clear from sessionStorage
      sessionStorage.removeItem('authToken')
    },

    loadMistralAPIKey() {
      const storedValue = localStorage.getItem('mistralAPIKey')
      this.mistralAPIKey = storedValue !== null ? storedValue : ''
    },

    // Add method to initialize store from storage
    init() {
      // Load auth token from sessionStorage
      const storedToken = sessionStorage.getItem('authToken')
      if (storedToken) {
        this.authToken = storedToken
      }
      this.loadMistralAPIKey()
    },
  },
})
