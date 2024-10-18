<template>
  <v-app>
    <v-app-bar color="#BBBBBB">
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
      <ProfileDropdown v-if="isAuthenticated()" />
    </v-app-bar>

    <router-view />

    <v-main v-if="!isAuthenticated()">
      <v-container>
        <v-row justify="center">
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
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import HankoAuth from './components/HankoAuth.vue'
import ProfileDropdown from './components/ProfileDropdown.vue'

const { t } = useI18n()
const userStore = useUserStore()
const { authToken, mistralAPIKey } = storeToRefs(userStore)
console.log("retrieved token from store: '" + authToken.value + "'")

console.info('using Mistral API key: ' + mistralAPIKey)
console.log(t('send'))

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
