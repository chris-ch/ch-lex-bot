import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Message {
  sender: 'user' | 'assistant'
  text: string
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])

  function addMessage(message: Message) {
    messages.value.push(message)
  }

  function clearMessages() {
    messages.value = []
  }

  return { messages, addMessage, clearMessages }
}, {
  persist: {
    storage: sessionStorage,
  },
})
