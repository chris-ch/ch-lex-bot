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
      <v-card class="rounded-xl pa-4" outlined v-if="chatStore.messages.length">
        <div class="messages">
          <div
            v-for="(message, index) in chatStore.messages"
            :key="index"
            :class="message.sender"
            class="pa-4"
          >
            <v-chip
              :color="message.sender === 'assistant' ? 'success' : 'indigo'"
              class="message-chip rounded-lg pa-4"
            >
            <v-row>
              <v-col cols="2">
                <template v-if="message.sender === 'assistant'">
                <span><v-icon>mdi-robot</v-icon>&nbsp;💬</span>
              </template>
            </v-col>
            <v-col cols="10">
              <span class="message-text">{{ message.text }}</span>
            </v-col>
            </v-row>
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
import { useChatStore } from '@/stores/chatStore'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const userStore = useUserStore()
const chatStore = useChatStore()

const userMessage = ref('')
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
    chatStore.addMessage({ sender: 'user', text: userMessage.value })
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
    chatStore.addMessage({ sender: 'assistant', text: message })
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
