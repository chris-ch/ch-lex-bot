<template>
  <v-app>
    <v-app-bar color="#BBBBBB">
      <v-toolbar-title>
        <a href="https://revault.ch/" target="_blank" rel="noopener noreferrer">
          <img alt="Company logo" src="./assets/logo-revault.svg" width="200" />
        </a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <LanguageSwitcher />
      <ProfileDropdown v-if="isAuthenticated()" />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view v-if="isAuthenticated()" />
        <v-row v-else>
          <v-col>
            <HankoAuth />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app color="#BBBBBB" elevation="5"> Revault sàrl - 2024 </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
//import HankoAuth from './components/HankoAuth.vue'
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
