import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface Message {
  sender: 'user' | 'assistant'
  text: string
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const userId = ref<string | null>(null)

  function init(id: string) {
    userId.value = id
    loadMessagesFromStorage()
  }

  function addMessage(message: Message) {
    messages.value.push(message)
    saveMessagesToStorage()
  }

  function clearMessages() {
    messages.value = []
    if (userId.value) {
      sessionStorage.removeItem(getStorageKey())
    }
  }

  // Helper function to create a unique storage key based on userId
  function getStorageKey() {
    return `chat-messages-${userId.value}`
  }

  // Load messages for the specific user from sessionStorage
  function loadMessagesFromStorage() {
    if (!userId.value) return
    const storedMessages = sessionStorage.getItem(getStorageKey())
    if (storedMessages) {
      messages.value = JSON.parse(storedMessages)
    }
  }

  // Save messages to sessionStorage
  function saveMessagesToStorage() {
    if (!userId.value) return
    sessionStorage.setItem(getStorageKey(), JSON.stringify(messages.value))
  }

  // Watch for changes to messages and persist them
  watch(messages, saveMessagesToStorage, { deep: true })

  return { messages, addMessage, clearMessages, init }
})
