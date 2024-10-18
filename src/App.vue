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
      <v-btn @click="logout" v-if="isAuthenticated()">Sign out</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <!-- App Logo -->
        <v-row justify="center" class="my-4">
          <v-col cols="auto">
            <img alt="LexBot logo" src="./assets/logo.svg" width="100" />
          </v-col>
        </v-row>

        <!--ChatBot
          v-if="isAuthenticated() && userInfo && userInfo.mistralAPIKey"
        >

        
        <div v-if="isAuthenticated() && (!userInfo || !userInfo.mistralAPIKey)">
          <p>{{ $t('mistral.key') }}</p>
          <input
            v-model="mistralAPIKeyInput"
            placeholder="Enter Mistral API Key"
          />
          <button @click="setMistralAPIKey">Submit</button>
        </div/-->

        <!-- Authentication -->
        <v-row justify="center" v-if="!isAuthenticated()">
          <v-col cols="12" md="6">
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
import { onMounted } from 'vue'

import LanguageSwitcher from './components/LanguageSwitcher.vue'
import HankoAuth from './components/HankoAuth.vue'
//import ChatBot from './components/ChatBot.vue'

// Reactive state for tracking authentication
//const mistralAPIKeyInput = ref('')

const userStore = useUserStore()
const { authToken, mistralAPIKey } = storeToRefs(userStore)
console.log("retrieved token from store: '" + authToken.value + "'")

console.info('using Mistral API key: ' + mistralAPIKey)

// Logout function to clear the token and log the user out
const logout = async () => {
  console.log('logging out')
  // Clear the user info from the Pinia store
  userStore.clearUserInfo()
}

/*const setMistralAPIKey = () => {
  if (mistralAPIKeyInput.value.trim()) {
    const updatedUserInfo = {
      ...userInfo.value,
      mistralAPIKey: mistralAPIKeyInput.value.trim(),
    }

    // Save the updated data into localStorage
    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))

    // Update the state
    userInfo.value = updatedUserInfo

    // Clear the input field
    mistralAPIKeyInput.value = ''
  } else {
    alert('Please enter a valid Mistral API Key.')
  }
}*/

onMounted(() => {
  //const { proxy } = getCurrentInstance()
  //console.log('current locale: ' + proxy.$i18n.locale)
})

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
