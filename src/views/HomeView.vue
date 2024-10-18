<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const newMistralAPIKey = ref('')

import ChatBot from '../components/ChatBot.vue'

const userStore = useUserStore()
const { authToken, mistralAPIKey } = storeToRefs(userStore)
console.log("retrieved token from store: '" + authToken.value + "'")

console.info('using Mistral API key: ' + mistralAPIKey)

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

<template>
  <v-main v-if="isAuthenticated()">
    <v-container fluid class="pa-0">
      <!-- App Logo -->
      <v-row justify="center" class="my-4">
        <v-col cols="auto">
          <img alt="LexBot logo" src="../assets/logo.svg" width="100" />
        </v-col>
      </v-row>

      <!-- Chat Bot -->
      <v-row justify="center" class="my-4" v-if="mistralAPIKey">
        <v-col cols="12" class="pa-0">
          <ChatBot />
        </v-col>
      </v-row>

      <!-- Mistral Key -->
      <v-row justify="center" v-else>
        <v-col cols="12" sm="8" md="6" lg="4" class="mx-auto">
          <v-card-text>
            <p class="text-body-1 mb-4">{{ t('mistral.key') }}</p>
            <v-text-field
              v-model="newMistralAPIKey"
              :placeholder="t('user.input.mistral.key')"
              variant="outlined"
              hide-details
              width="600"
              class="mb-4"
            />
            <v-btn
              color="primary"
              block
              @click="setMistralAPIKey"
              :disabled="!newMistralAPIKey.trim()"
            >
              Submit
            </v-btn>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
