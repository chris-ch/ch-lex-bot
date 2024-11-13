<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const newMistralAPIKey = ref('')

import ChatBot from '../components/ChatBot.vue'

const userStore = useUserStore()
const { mistralAPIKey } = storeToRefs(userStore)

console.info('using Mistral API key: ' + mistralAPIKey)

const setMistralAPIKey = () => {
  if (newMistralAPIKey.value.trim()) {
    userStore.setMistralAPIKey(newMistralAPIKey.value)
    newMistralAPIKey.value = '' // Clear the input after setting
  } else {
    alert('Please enter a valid Mistral API Key.')
  }
}
</script>

<template>
  <!-- App Logo -->
  <v-row justify="center">
    <v-col cols="auto">
      <img alt="LexBot logo" src="../assets/logo.svg" width="100" />
    </v-col>
  </v-row>

  <!-- Chat Bot -->
  <v-row justify="center" v-if="mistralAPIKey">
    <v-col cols="12">
      <ChatBot />
    </v-col>
  </v-row>

  <!-- Mistral Key -->
  <v-row justify="center" v-else>
    <v-col>
      <v-card-text>
        <p class="text-body-1">{{ t('mistral.key') }}</p>
        <v-text-field
          v-model="newMistralAPIKey"
          :placeholder="t('user.input.mistral.key')"
          variant="filled"
          hide-details
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
</template>
