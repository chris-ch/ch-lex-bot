<template>
  <v-row justify="center">
    <v-col cols="12" md="12">
      <v-alert
        v-model="showAlert"
        type="error"
        closable
        transition="scale-transition"
      >
        {{ t('error.unknown') }} {{ errorMessage }}
      </v-alert>
    </v-col>
  </v-row>

  <!-- Header Section -->
  <v-row justify="center">
    <v-col cols="12" md="8">
      <v-card class="rounded-xl" outlined>
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
    </v-col>
  </v-row>

  <!-- Chat Messages Section -->

  <v-row justify="center">
    <v-col cols="12" md="8">
      <v-card class="rounded-xl" outlined v-if="messages.length">
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
                <span class="mr-1"><v-icon>mdi-robot</v-icon>💬</span>
              </template>
              <span class="message-text">{{ message.text }}</span>
            </v-chip>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <!-- Input Section -->

  <v-row justify="center">
    <v-col cols="12" md="8">
      <v-card class="rounded-xl" outlined>
        <v-row>
          <v-col>
            <v-textarea
              v-model="userMessage"
              :label="t('user.case.description')"
              outlined
              rounded="large"
              rows="5"
              auto-grow
              hide-details
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="pt-4 pb-4 pr-4">
          <v-col class="d-flex justify-end">
            <v-btn color="primary" @click="sendMessage">{{ t('send') }}</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
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
  const modelCode = 'mistral-large-2407' // "mistral-large-2407", "open-mistral-nemo-2407", "open-mistral-7b", "mistral-tiny"
  try {
    const llmResponse = await client.chat.complete({
      model: modelCode,
      messages: [
        {
          role: 'user',
          content:
            t('prompt.suggestions.intro') +
            '[user]' +
            userMessage.value +
            '[/user]' +
            t('prompt.suggestions.instruct'),
        },
      ],
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
