<template>
  <div class="d-flex justify-center">
    <hanko-auth @onSessionCreated="onAuthenticated"></hanko-auth>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from 'node_modules/jwt-decode/build/cjs'

const userStore = useUserStore()

interface CustomJwtPayload extends JwtPayload {
  email?: {
    address?: string
  }
}

const decodeUserId = (token: string): string | undefined => {
  try {
    // Decode the token as a CustomJwtPayload
    const decoded = jwtDecode<CustomJwtPayload>(token)
    return decoded.email?.address // Access the email address if available
  } catch (error) {
    console.error('Invalid token', error)
    return undefined
  }
}

// Event handler function for when a session is created
const onAuthenticated = (event: CustomEvent<{ jwt: string }>) => {
  console.log('authentication succeeded:', event)

  const authToken = event.detail.jwt

  const userId = decodeUserId(authToken)
  console.log('decoded user id from token', userId)

  if (userId) {
    userStore.init(userId)
    userStore.loadMistralAPIKey()
    console.log('stored user token: ' + authToken)
  }
}
</script>
