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
      <ProfileDropdown v-if="isAuthenticated" />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view v-if="isAuthenticated" />
        <v-row v-else>
          <v-col>
            <CognitoAuth />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app color="#BBBBBB" elevation="5" class="justify-end">
      <div>
        <span style="color: #e03e29">re</span>&nbsp;<span style="color: #d2d2d2"
          >|</span
        >&nbsp;<span style="color: #505050">vault sàrl - 2024</span>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { onMounted, ref, computed } from 'vue'
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import CognitoAuth from './components/CognitoAuth.vue'
import ProfileDropdown from './components/ProfileDropdown.vue'

const { t } = useI18n()
const userStore = useUserStore()
const { mistralAPIKey } = storeToRefs(userStore)
const isAuthLoading = ref(true)

console.info('using Mistral API key: ' + mistralAPIKey)
console.log(t('send'))

// Check if user is already authenticated on component mount
onMounted(async () => {
  try {
    // Check if there's a current user session
    const currentUser = await getCurrentUser()
    
    if (currentUser) {
      // Fetch user attributes
      const attributes = await fetchUserAttributes()
      
      // Set user ID (typically using sub attribute or preferred_username)
      const userId = attributes.sub || attributes.preferred_username || currentUser.username
      userStore.setUserId(userId)
      
      // Set email if available
      if (attributes.email) {
        userStore.setUserEmail(attributes.email)
      }
    }
  } catch {
    console.log('Not signed in')
  } finally {
    isAuthLoading.value = false
  }
})

// Computed property for authentication status
const isAuthenticated = computed(() => {
  return !!userStore.userId
})
</script>