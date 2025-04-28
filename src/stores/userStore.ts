import { defineStore } from 'pinia'
import { signOut } from 'aws-amplify/auth'

interface UserInfo {
  userId: string | null
  userEmail: string | null
  mistralAPIKey: string
}

export const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    userId: null,
    userEmail: null,
    mistralAPIKey: '',
  }),

  actions: {
    setUserId(id: string | null) {
      this.userId = id
    },

    setUserEmail(email: string | null) {
      this.userEmail = email
    },

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

    init(userId: string, email: string | null = null) {
      this.userId = userId
      this.userEmail = email
      this.loadMistralAPIKey()
    },

    async logout() {
      try {
        // Sign out from Cognito
        await signOut()
        
        // Clear local state
        this.clearUserData()
      } catch (error) {
        console.error('Error signing out:', error)
      }
    },

    clearUserData() {
      if (this.userId) {
        localStorage.removeItem(`mistralAPIKey-${this.userId}`)
      }
      this.userId = null
      this.userEmail = null
      this.mistralAPIKey = ''
    },
  },
})
