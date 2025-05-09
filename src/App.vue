<template>
  <authenticator
    :form-fields="{
      signUp: {
        email: { order: 1 },
        password: { order: 2 },
        'custom:openai-api-key': {
          label: 'OpenAI API Key (Optional)',
          placeholder: 'sk-...',
          required: false,
          order: 1,
        },
      },
    }"
    v-slot="{ user, signOut }"
  >
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
          <v-alert
            type="warning"
            border="start"
            colored-border
            prominent
            class="footer-alert"
          >
            {{ t('warning.message') }}
          </v-alert>
          <span style="color: #e03e29">re</span>&nbsp;<span
            style="color: #d2d2d2"
            >|</span
          >&nbsp;<span style="color: #505050">vault sàrl - 2025</span>
        </div>
      </v-footer>
    </v-app>
  </authenticator>
</template>

<script setup lang="ts">
import { watch, toRefs } from 'vue'
import { useAuthenticator } from '@aws-amplify/ui-vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore'
import { useChatStore } from '@/stores/chatStore'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import ProfileDropdown from './components/ProfileDropdown.vue'

const { t } = useI18n()
const { user } = toRefs(useAuthenticator())
const userStore = useUserStore()
const chatStore = useChatStore()

watch(
  user,
  u => {
    if (u) {
      const id = u.attributes?.sub || u.username
      userStore.setUserId(id)
      userStore.setUserEmail(u.attributes?.email ?? null)
      localStorage.setItem('userId', id)
      chatStore.init(id)
      console.log('User ID:', id)
    } else {
      userStore.$reset()
      chatStore.clearMessages()
      localStorage.removeItem('userId')
    }
  },
  { immediate: true }
)
</script>
