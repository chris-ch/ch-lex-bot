<template>
  <v-app>
    <v-container>
      <v-alert
        v-model="showAlert"
        type="error"
        closable
        transition="scale-transition"
      >
        {{ t('error.unknown') }} {{ errorMessage }}
      </v-alert>

      <!-- Header Section -->
      <v-card class="pa-4 rounded-xl" outlined>
        <v-card-title>Lex 🇨🇭 Bot</v-card-title>
        <v-card-subtitle>{{ t('bot.welcome') }}</v-card-subtitle>
        <v-card-text>
          <p class="text-body-1 mb-6">{{ t('bot.role') }}</p>
          <p class="text-body-1 mb-6">{{ t('bot.purpose') }}</p>
          <p class="text-body-1">
            <strong>{{ t('bot.start') }}</strong>
          </p>
        </v-card-text>
      </v-card>

      <!-- Chat Messages Section -->
      <v-card class="pa-4 mt-4 rounded-xl" outlined v-if="messages.length">
        <div class="messages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="message.sender"
          >
            <v-chip
              :color="message.sender === 'assistant' ? 'success' : 'indigo'"
              class="ma-2 message-chip full-width rounded-lg"
            >
              <template v-slot:prepend v-if="message.sender === 'assistant'">
                <span class="mr-1">🤖💬&NonBreakingSpace;</span>
              </template>
              <span class="message-text">{{ message.text }}</span>
            </v-chip>
          </div>
        </div>
      </v-card>

      <!-- Input Section -->
      <v-card class="pa-4 mt-4 rounded-xl" outlined>
        <v-row>
          <v-col cols="10">
            <v-textarea
              v-model="userMessage"
              :label="t('user.case.description')"
              outlined
              rounded="large"
              rows="3"
              auto-grow
              hide-details
            ></v-textarea>
          </v-col>
          <v-col cols="2">
            <v-btn color="primary" @click="sendMessage">Send</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Mistral } from '@mistralai/mistralai'
import { useUserStore } from '@/stores/userStore'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const userStore = useUserStore()

interface Message {
  sender: 'user' | 'assistant'
  text: string
}

const userMessage = ref('')
const messages = ref<Message[]>([])
const showAlert = ref(false)
const errorMessage = ref('')
const props = defineProps({
  showUnknownError: {
    type: String,
    default: '',
  },
})

watch(
  () => props.showUnknownError,
  newValue => {
    errorMessage.value = newValue
    showAlert.value = !!newValue
  },
)

const client = new Mistral({ apiKey: userStore.mistralAPIKey })

function sendMessage() {
  if (userMessage.value.trim()) {
    messages.value.push({ sender: 'user', text: userMessage.value })
    loadBotResponse()
    userMessage.value = ''
  }
}

async function loadBotResponse() {
  try {
    const llmResponse = await client.chat.complete({
      model: 'mistral-tiny',
      messages: [{ role: 'user', content: 'What is the best French cheese?' }],
    })
    const message =
      (llmResponse.choices && llmResponse.choices[0].message.content) || ''
    messages.value.push({ sender: 'assistant', text: message })
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Check if the error is a 401 Unauthorized error
      if (error.name === 'SDKError') {
        // Extract status code
        const statusMatch = error.message.match(/Status (\d+)/)
        if (statusMatch) {
          const errorStatus = parseInt(statusMatch[1], 10)
          if (errorStatus === 401) {
            console.log('resetting userinfo field mistralAPIKey')
            userStore.setMistralAPIKey('')
          } else {
            errorMessage.value = '' + errorStatus
            showAlert.value = true
            console.error('an error occurred:', error)
          }
        } else {
          errorMessage.value = error.message
          showAlert.value = true
          console.error('an error occurred:', error)
        }
      } else {
        errorMessage.value = error.message
        showAlert.value = true
        console.error('an error occurred:', error)
      }
    }
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
  max-width: 100%;
}

.bot {
  text-align: left;
}

.user {
  text-align: left;
}

.message-chip {
  height: auto !important;
  white-space: normal;
  padding-top: 8px;
  padding-bottom: 8px;
}

.message-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
  padding: 12px;
  font-size: 18px;
}
</style>
