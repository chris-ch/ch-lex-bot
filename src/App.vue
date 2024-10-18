<template>
  <v-app>
    <v-app-bar app color="#BBBBBB">
      <v-toolbar-title>
        <a href="https://revault.ch/" target="_blank" rel="noopener noreferrer">
          <img
            alt="Company logo"
            src="./assets/logo-revault.svg"
            width="200"
            class="company-logo"
          />
        </a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <LanguageSwitcher />
      <v-btn @click="logout" v-if="isAuthenticated()">{{ t('logout') }}</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <!-- App Logo -->
        <v-row justify="center" class="my-4">
          <v-col cols="auto">
            <img alt="LexBot logo" src="./assets/logo.svg" width="100" />
          </v-col>
        </v-row>

        <!-- Chat Bot -->
        <v-row
          justify="center"
          class="my-4"
          v-if="isAuthenticated() && mistralAPIKey"
        >
          <v-col cols="12" md="12" lg="12" xl="12">
            <ChatBot />
          </v-col>
        </v-row>

        <!-- Mistral Key -->
        <v-row justify="center" v-if="isAuthenticated() && !mistralAPIKey">
          <v-col cols="12" md="12" lg="12" xl="12">
            <p>{{ t('mistral.key') }}</p>
            <input
              placeholder="Enter Mistral API Key"
              v-model="newMistralAPIKey"
            />
            <button @click="setMistralAPIKey">Submit</button>
          </v-col>
        </v-row>

        <!-- Authentication -->
        <v-row justify="center" v-if="!isAuthenticated()">
          <v-col cols="auto">
            <HankoAuth />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const newMistralAPIKey = ref('')

import LanguageSwitcher from './components/LanguageSwitcher.vue'
import HankoAuth from './components/HankoAuth.vue'
import ChatBot from './components/ChatBot.vue'

const userStore = useUserStore()
const { authToken, mistralAPIKey } = storeToRefs(userStore)
console.log("retrieved token from store: '" + authToken.value + "'")

console.info('using Mistral API key: ' + mistralAPIKey)

// Logout function to clear the token and log the user out
const logout = async () => {
  console.log('logging out')
  // Clear the user info from the Pinia store
  userStore.clearAuthToken()
}

const setMistralAPIKey = () => {
  if (newMistralAPIKey.value.trim()) {
    userStore.setMistralAPIKey(newMistralAPIKey.value)
    newMistralAPIKey.value = '' // Clear the input after setting
  } else {
    alert('Please enter a valid Mistral API Key.')
  }
}

const isAuthenticated = (): boolean => {
  console.log('checking token: "' + authToken.value + '""')
  return !!authToken.value && authToken.value.length > 0
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
