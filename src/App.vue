<template>
  <v-app>
    <v-app-bar app color="#BBBBBB">
      <v-toolbar-title>
        <a href="https://revault.ch/" target="_blank" rel="noopener noreferrer">
        <img alt="Company logo" src="./assets/logo-revault.svg" width="200" class="company-logo" />
      </a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <LanguageSwitcher />
      <v-btn @click="logout" v-if="isAuthenticated()">Sign out</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <img alt="Vue logo" src="./assets/logo.svg" width="100" v-if="isAuthenticated()">
        <ChatBot v-if="isAuthenticated() && userInfo && userInfo.mistralAPIKey" />
        <div v-if="isAuthenticated() && (!userInfo || !userInfo.mistralAPIKey)">
          <p>{{ $t('mistral.key') }}</p>
          <input v-model="mistralAPIKeyInput" placeholder="Enter Mistral API Key" />
          <button @click="setMistralAPIKey">Submit</button>
        </div>
        <HankoAuth v-if="!isAuthenticated()" @onSessionCreated="onAuthenticated" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, onMounted, getCurrentInstance  } from 'vue';

  import LanguageSwitcher from './components/LanguageSwitcher.vue';
  import HankoAuth from './components/HankoAuth.vue';
  import ChatBot from './components/ChatBot.vue';

  // Reactive state for tracking authentication
  const userInfo = ref(null);
  const mistralAPIKeyInput = ref('');

  // Initialize userInfo on component creation
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo);
  }

  // Event handler function for when a session is created
  const onAuthenticated = (event) => {
    console.log('session created:', event.detail);
    
    // Update the state
    userInfo.value = JSON.parse(localStorage.getItem('userInfo'));
  };

  // Logout function to clear the token and log the user out
  const logout = () => {
    localStorage.removeItem('userInfo'); // Clear the token from storage
    userInfo.value = null;
  };

  const setMistralAPIKey = () => {
    if (mistralAPIKeyInput.value.trim()) {
      const updatedUserInfo = {
        ...userInfo.value,
        mistralAPIKey: mistralAPIKeyInput.value.trim(),
      };

      // Save the updated data into localStorage
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

      // Update the state
      userInfo.value = updatedUserInfo;

      // Clear the input field
      mistralAPIKeyInput.value = '';
    } else {
      alert('Please enter a valid Mistral API Key.');
    }
  };

  onMounted(() => {
    const { proxy } = getCurrentInstance();
    console.log("current locale: " + proxy.$i18n.locale);
  });

  const isAuthenticated = () => {
    return !!userInfo.value?.authToken;
  };

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
