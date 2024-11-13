<template>
  <div class="d-flex justify-center">
    <hanko-auth @onSessionCreated="onAuthenticated"></hanko-auth>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

// Event handler function for when a session is created
const onAuthenticated = (event: CustomEvent<{ jwt: string }>) => {
  console.log('authentication succeeded:', event)

  userStore.setAuthToken(event.detail.jwt)
  userStore.loadMistralAPIKey()
  console.log('stored user token: ' + event.detail.jwt)
}
</script>
