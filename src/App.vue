<template>
  <authenticator
    :form-fields="{
      signUp: {
        email: { order: 1 },
        password: { order: 2 },
      },
    }"
    :social-providers="['google']"
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

      <v-footer app color="#BBBBBB" elevation="5" class="d-flex flex-column">
        <div class="w-100 text-center">
          <v-alert
            type="warning"
            border="start"
            colored-border
            prominent
            class="footer-alert mx-auto"
            max-width="800px"
          >
            {{ t('warning.message') }}
          </v-alert>
        </div>
        <div class="d-flex justify-end w-100 mt-2">
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
import { fetchUserAttributes, type UserAttributeKey } from 'aws-amplify/auth'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStore'
import { useChatStore } from '@/stores/chatStore'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import ProfileDropdown from './components/ProfileDropdown.vue'

const { t } = useI18n()
const { user } = toRefs(useAuthenticator())
const userStore = useUserStore()
const chatStore = useChatStore()

type Attrs = Partial<Record<UserAttributeKey, string>>

watch(
  user,
  async u => {
    if (!u) {
      // signed-out
      userStore.$reset()
      chatStore.clearMessages()
      localStorage.removeItem('userId')
      return
    }

    // ---- signed-in ----
    const id = u.userId ?? u.username
    userStore.setUserId(id)
    localStorage.setItem('userId', id)

    const attrs: Attrs = await fetchUserAttributes().catch(() => ({}) as Attrs)
    const email = attrs.email ?? u.signInDetails?.loginId ?? null

    userStore.setUserEmail(email)
    console.log('Attributes  :', attrs)
    console.log('Email chosen:', email)

    userStore.setUserEmail(email)
    chatStore.init(id)
  },
  { immediate: true }
)
</script>

<style>
.footer-alert {
  width: 100%;
  max-width: 800px !important;
}
</style>
