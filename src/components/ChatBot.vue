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
                  <span
                    class="message-text"
                    v-html="
                      message.sender === 'assistant'
                        ? parseMarkdown(message.text)
                        : message.text
                    "
                  />
                </v-col>
              </v-row>
            </v-chip>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <!-- Input Section -->

  <v-row justify="center" v-if="!messageSent">
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
import { useChatStore } from '@/stores/chatStore'
import { useI18n } from 'vue-i18n'
import { fetchAuthSession } from 'aws-amplify/auth'
import type { AnalysisResult } from '@/types/fedCourtDecisions'
import { marked } from 'marked'

// Modern renderer object: each method receives a token object
const renderer = {
  link({
    href,
    title,
    text,
  }: {
    href: string
    title?: string | null
    text: string
  }) {
    const safeTitle = title ? ` title="${title}"` : ''
    return `<a href="${href}" target="_blank" rel="noopener noreferrer"${safeTitle}>${text}</a>`
  },
}

// Apply using marked.use — NOT setOptions!
marked.use({ renderer })

function parseMarkdown(text: string): string {
  return marked.parse(text) as string
}

// Types
interface Props {
  showUnknownError: string
}

// Constants
const ERROR_CODES = {
  UNAUTHORIZED: 401,
} as const

// Composables
const { t } = useI18n()
const chatStore = useChatStore()

const userMessage = ref('')
const messageSent = ref(false)
const showAlert = ref(false)
const errorMessage = ref('')

// Props
const props = defineProps<Props>()

// Watchers
watch(
  () => props.showUnknownError,
  newValue => {
    errorMessage.value = newValue
    showAlert.value = Boolean(newValue)
  }
)

// Error handling
const handleError = (error: unknown) => {
  if (!(error instanceof Error)) {
    console.error('Unknown error type:', error)
    return
  }

  if (error.name === 'SDKError') {
    const statusMatch = error.message.match(/Status (\d+)/)
    if (!statusMatch) {
      setError(error.message)
      return
    }

    const errorStatus = parseInt(statusMatch[1], 10)
    if (errorStatus === ERROR_CODES.UNAUTHORIZED) {
      return
    }

    setError(`Error ${errorStatus}`)
  } else {
    setError(error.message)
  }
}

const setError = (message: string) => {
  errorMessage.value = message
  showAlert.value = true
  console.error('An error occurred:', message)
}

// Main functions
async function sendMessage() {
  const trimmedMessage = userMessage.value.trim()
  if (!trimmedMessage) return

  chatStore.addMessage({ sender: 'user', text: trimmedMessage })

  messageSent.value = true
  const decisions = await findDecisions(trimmedMessage)

  // Pass results to loadBotResponse
  await loadBotResponse(trimmedMessage, decisions)

  userMessage.value = ''
  messageSent.value = true
}
async function findDecisions(message: string): Promise<AnalysisResult[]> {
  try {
    const session = await fetchAuthSession()
    const idToken = session.tokens?.idToken?.toString()

    if (!idToken) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(
      'https://ykbuwr0csh.execute-api.us-east-1.amazonaws.com/default/manual-fed-court-decisions-search',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          label_decision: t('label.decision'),
          message_prompt_system: t('message.prompt.system'),
          message_prompt_user_prefix: t('message.prompt.user.prefix'),
          sentences: [message],
        }),
      }
    )

    if (!response.ok) {
      console.error('API Gateway call failed:', response.statusText)
      return []
    }
    const body = await response.json()
    return body.analyses ?? []
  } catch (error) {
    console.error('Error while calling decisions API:', error)
    return []
  }
}

async function loadBotResponse(message: string, analyses: AnalysisResult[]) {
  try {
    for (const analysis of analyses) {
      let enrichedText = analysis.analysis

      for (const doc of analysis.documents) {
        const escapedDocRef = doc.docref.replace(
          /[-\/\\^$*+?.()|[\]{}]/g,
          '\\$&'
        ) // Escape for RegExp
        const regex = new RegExp(`\\b${escapedDocRef}\\b`, 'g')

        // Replace the reference with a Markdown link if it appears
        if (regex.test(enrichedText)) {
          enrichedText = enrichedText.replace(
            regex,
            `[${doc.docref}](${doc.url})`
          )
        }
      }

      chatStore.addMessage({
        sender: 'assistant',
        text: `🔍 **Analyse** : ${enrichedText}`,
      })
    }
  } catch (error) {
    handleError(error)
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
