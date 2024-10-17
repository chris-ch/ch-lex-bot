<template>
  <v-app>
    <v-container>
      <!-- Header Section -->
      <v-card class="pa-4 rounded-xl" outlined>
        <v-card-title>
          <h1>💬 Lex Bot 🇨🇭</h1>
        </v-card-title>
        <v-card-subtitle>{{ $t('welcome') }}</v-card-subtitle>
        <v-card-text>
          <p>
            For a guide and recipes on how to configure / customize this project,<br>
            check out the
            <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
          </p>
        </v-card-text>
      </v-card>

      <!-- Chat Messages Section -->
      <v-card class="pa-4 mt-4 rounded-xl" outlined v-if="messages.length">
        <div class="messages">
          <div v-for="(message, index) in messages" :key="index" :class="message.sender">
            <v-chip
              :color="message.sender === 'bot' ? 'success' : 'indigo'"
              class="ma-2 message-chip full-width rounded-lg"
            >
              <template v-slot:prepend v-if="message.sender === 'bot'">
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
              label="Type a message..."
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
  
  <script>
  export default {
    data() {
      return {
        userMessage: "",
        messages: [],
      };
    },
    methods: {
      sendMessage() {
        if (this.userMessage.trim()) {
          this.messages.push({ sender: "user", text: this.userMessage });
          this.getBotResponse();
          this.userMessage = "";
        }
      },
      getBotResponse() {
        // Example API call - replace with your actual chatbot logic or API call
        setTimeout(() => {
          const botMessage = "This is a response from the bot.\nIt can span multiple lines\n\nlike so.";
          this.messages.push({ sender: "bot", text: botMessage });
        }, 1000);
      },
    },
  };
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
}
</style>
