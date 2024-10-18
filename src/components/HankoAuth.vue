<template>
  <div>
    <hanko-auth @onSessionCreated="onAuthenticated"></hanko-auth>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

// Event handler function for when a session is created
const onAuthenticated = (event: CustomEvent<{ jwt: string }>) => {
  console.log('authentication succeeded:', event)
  const userInfo = {
    authToken: event.detail.jwt,
    mistralAPIKey: undefined,
  }

  userStore.setUserInfo(userInfo)
  console.log('stored user token: ' + userInfo.authToken)
}
</script>
