<template>
  <authenticator v-slot="{ user, signOut }">
    <!-- Everything inside this slot renders only when the user is signed-in -->
    <v-app>
      <v-app-bar color="#BBBBBB">
        <v-toolbar-title>
          <a
            href="https://revault.ch/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="Company logo"
              src="./assets/logo-revault.svg"
              width="200"
            />
          </a>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <LanguageSwitcher />
        <ProfileDropdown :user="user" @signOut="signOut" />
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-main>

      <v-footer app color="#BBBBBB" elevation="5" class="justify-end">
        <div>
          <span style="color: #e03e29">re</span>&nbsp;<span
            style="color: #d2d2d2"
            >|</span
          >&nbsp;<span style="color: #505050">vault sàrl - 2024</span>
        </div>
      </v-footer>
    </v-app>
  </authenticator>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import ProfileDropdown from './components/ProfileDropdown.vue'
import { watch } from 'vue'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue'

const { t } = useI18n()
const { user } = useAuthenticator()
const userStore = useUserStore()
const { mistralAPIKey } = storeToRefs(userStore)

watch(
  () => user.value,
  u => {
    if (u) {
      userStore.setUserId(u.userId ?? u.username)
      if (u.attributes?.email) userStore.setUserEmail(u.attributes.email)
    } else {
      userStore.$reset()
    }
  },
  { immediate: true },
)

console.info('using Mistral API key: ' + mistralAPIKey)
console.log(t('send'))
</script>
