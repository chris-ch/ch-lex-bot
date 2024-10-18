import { defineStore } from 'pinia'

interface UserInfo {
  authToken: string
  mistralAPIKey: string | undefined
}

export const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    authToken: '',
    mistralAPIKey: undefined,
  }),
  actions: {
    setUserInfo(userInfo: UserInfo) {
      this.authToken = userInfo.authToken
      this.mistralAPIKey = userInfo.mistralAPIKey
    },
    clearUserInfo() {
      this.authToken = ''
      this.mistralAPIKey = undefined
    },
  },
  persist: true,
})
