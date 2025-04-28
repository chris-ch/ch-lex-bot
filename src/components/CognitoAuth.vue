<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-center">Sign In</v-card-title>

          <v-form @submit.prevent="signIn">
            <v-text-field
              v-model="username"
              label="Username or Email"
              required
              variant="outlined"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              required
              variant="outlined"
              class="mb-4"
            ></v-text-field>

            <v-btn block color="primary" type="submit" :loading="loading">
              Sign In
            </v-btn>
          </v-form>

          <v-divider class="my-4"></v-divider>

          <div class="text-center">
            <v-btn variant="text" @click="showForgotPassword = true">
              Forgot Password?
            </v-btn>
          </div>

          <v-alert
            v-if="errorMessage"
            type="error"
            class="mt-4"
            closable
            @click:close="errorMessage = ''"
          >
            {{ errorMessage }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- Forgot Password Dialog -->
    <v-dialog v-model="showForgotPassword" max-width="500px">
      <v-card class="pa-4">
        <v-card-title>Reset Password</v-card-title>
        <v-form @submit.prevent="sendResetCode">
          <v-text-field
            v-model="resetEmail"
            label="Email"
            required
            variant="outlined"
          ></v-text-field>

          <v-btn block color="primary" type="submit" :loading="resetLoading">
            Send Reset Code
          </v-btn>
        </v-form>

        <v-btn variant="text" class="mt-4" @click="showForgotPassword = false">
          Cancel
        </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  signIn as awsSignIn,
  resetPassword,
  fetchUserAttributes,
} from 'aws-amplify/auth'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Forgot password
const showForgotPassword = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)

const signIn = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please enter both username and password'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const signInOutput = await awsSignIn({
      username: username.value,
      password: password.value,
    })

    if (signInOutput.isSignedIn) {
      // Get user attributes
      const attributes = await fetchUserAttributes()

      // Set user ID (typically using sub attribute or preferred_username)
      const userId =
        attributes.sub || attributes.preferred_username || username.value
      userStore.setUserId(userId)

      // Set email if available
      if (attributes.email) {
        userStore.setUserEmail(attributes.email)
      }

      console.log('Successfully signed in')
    }
  } catch (error) {
    console.error('Sign in error:', error)
    errorMessage.value =
      error instanceof Error ? error.message : 'Sign in failed'
  } finally {
    loading.value = false
  }
}

const sendResetCode = async () => {
  if (!resetEmail.value) {
    errorMessage.value = 'Please enter your email'
    return
  }

  resetLoading.value = true

  try {
    await resetPassword({ username: resetEmail.value })
    // Here you would typically navigate to a password reset confirmation page
    alert('Password reset code sent. Check your email.')
    showForgotPassword.value = false
  } catch (error) {
    console.error('Reset password error:', error)
    errorMessage.value =
      error instanceof Error ? error.message : 'Failed to send reset code'
  } finally {
    resetLoading.value = false
  }
}
</script>
