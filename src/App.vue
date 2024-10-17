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
      <v-btn @click="logout" v-if="isAuthenticated">Sign out</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <img alt="Vue logo" src="./assets/logo.svg" width="100" v-if="isAuthenticated">
        <ChatBot v-if="isAuthenticated" />
        <HankoAuth v-if="!isAuthenticated" @onSessionCreated="onAuthenticated" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';  // Import ref to create reactive state
import { onMounted, getCurrentInstance } from 'vue';

import LanguageSwitcher from './components/LanguageSwitcher.vue';
import HankoAuth from './components/HankoAuth.vue';
import ChatBot from './components/ChatBot.vue';

// Reactive state for tracking authentication
const isAuthenticated = ref(false);

// Check for JWT in localStorage on app load
const token = localStorage.getItem('authToken');
if (token) {
  // Mark user as authenticated if token exists
  isAuthenticated.value = true;
}

// Event handler function for when a session is created
const onAuthenticated = (event) => {
  console.log('session created:', event.detail);
  
  // Update the state to reflect that the user is authenticated
  isAuthenticated.value = true;
};

// Logout function to clear the token and log the user out
const logout = () => {
  localStorage.removeItem('authToken'); // Clear the token from storage
  isAuthenticated.value = false;        // Mark the user as logged out
};

const { proxy } = getCurrentInstance();

onMounted(() => {
  console.log(proxy.$i18n.locale); // This should print 'en' or the current locale
});

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
