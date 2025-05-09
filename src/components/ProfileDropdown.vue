<template>
  <v-menu v-model="dropdown" :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in menuItems"
        :key="index"
        @click="handleMenuClick(item)"
      >
        <v-list-item-title>{{ item }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()

const dropdown = ref(false)
const menuItems = ref(['Profile', 'Settings', t('logout')])

watchEffect(() => {
  menuItems.value = ['Profile', 'Settings', t('logout')]
})

const handleMenuClick = (item: string) => {
  console.log('Menu item clicked:', item)
  // Handle the click event for the menu item
  // For example, you can navigate to different pages or perform actions
  if (item === t('logout')) {
    logout()
  }
}

// Logout function to clear the token and log the user out
const logout = async () => {
  console.log('logging out')
  // Clear the user info from the Pinia store
  userStore.logout()
}
</script>
