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
import type { ModelCode } from '@/types/mistral'
import { useI18n } from 'vue-i18n'
import type { ChatCompletionResponse } from '@mistralai/mistralai/models/components'
import type { ContentChunk } from '@mistralai/mistralai/models/components'
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity'
import type { DecisionMapping } from '@/types/fedCourtDecisions'

// Types
interface Props {
  showUnknownError: string
}

// Constants
const MODEL_CODE: ModelCode = 'mistral-large-2407'
const ERROR_CODES = {
  UNAUTHORIZED: 401,
} as const

// Composables
const { t } = useI18n()
const userStore = useUserStore()
const chatStore = useChatStore()

// Refs
const userMessage = ref('')
const showAlert = ref(false)
const errorMessage = ref('')

// Props
const props = defineProps<Props>()

const fedCourtDecisionsClient = new LambdaClient({
  region: 'us-east-1', // your region
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: 'us-east-1' },
    identityPoolId: 'us-east-1_APPGci0Uh', // your identity pool
  }),
})

// Initialize Mistral client
const getMistralClient = () => new Mistral({ apiKey: userStore.mistralAPIKey })

// Watchers
watch(
  () => props.showUnknownError,
  newValue => {
    errorMessage.value = newValue
    showAlert.value = Boolean(newValue)
  },
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
      console.log('Resetting Mistral API key due to unauthorized access')
      userStore.setMistralAPIKey('')
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

// Message handling
const buildRecapPrompt = (userInput: string): string => {
  return `${t('prompt.suggestions.intro')}[user]${userInput}[/user]${t('prompt.suggestions.instruct')}`
}

//const buildKeywordsPrompt = (userInput: string): string => {
//  return `${t('prompt.keywords.intro')}[user]${userInput}[/user]${t('prompt.keywords.instruct')}`
//}

function chunksToPlainText(
  chunks: string | ContentChunk[] | undefined,
): string {
  if (!chunks) return ''

  if (typeof chunks === 'string') return chunks // nothing to unwrap

  return chunks
    .map(chunk => {
      if (chunk.type === 'text') {
        return chunk.text // ✅ safe: TextChunk
      }
      if (chunk.type === 'image_url') {
        return `[image: ${chunk.imageUrl ?? '…'}]` // or '' if you prefer
      }
      return ''
    })
    .join('')
}

function processLLMResponse(response: ChatCompletionResponse) {
  const raw = response.choices?.[0]?.message?.content
  const text = chunksToPlainText(raw ?? undefined)
  chatStore.addMessage({ sender: 'assistant', text })
}

// Main functions
function sendMessage() {
  const trimmedMessage = userMessage.value.trim()
  if (!trimmedMessage) return

  chatStore.addMessage({ sender: 'user', text: trimmedMessage })

  // call Lambda and show result
  findDecisions(trimmedMessage).then(results => {
    const reply = results.map(r => `• [${r.docref}](${r.url})`).join('\n')

    chatStore.addMessage({ sender: 'user', text: reply || '(no result)' })
  })

  loadBotResponse()
  userMessage.value = ''
}

async function findDecisions(message: string): Promise<DecisionMapping[]> {
  const cmd = new InvokeCommand({
    FunctionName: 'manual-fed-court-decisions-search',
    Payload: new TextEncoder().encode(JSON.stringify({ sentences: [message] })),
  })

  const result = await fedCourtDecisionsClient.send(cmd)
  const payload = result.Payload ? new TextDecoder().decode(result.Payload) : ''

  try {
    const parsed = JSON.parse(payload)

    // Lambda is returning HTTP-style payload, need to parse `body` as well
    if (parsed.statusCode === 200 && parsed.body) {
      const body = JSON.parse(parsed.body)
      const firstResultSet = body.mappings?.[0] ?? []
      return firstResultSet
    } else {
      return []
    }
  } catch (err) {
    console.error('Failed to parse Lambda response:', err)
    return []
  }
}

async function loadBotResponse() {
  try {
    const client = getMistralClient()
    const llmResponse: ChatCompletionResponse = await client.chat.complete({
      model: MODEL_CODE,
      messages: [
        {
          role: 'user',
          content: buildRecapPrompt(userMessage.value),
        },
      ],
    })
    processLLMResponse(llmResponse)
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
