<template>
  <div id="app">

    <div class="top-bar">
      <!-- Company logo on the left -->
      <a href="https://revault.ch/" target="_blank" rel="noopener noreferrer">
        <img alt="Company logo" src="./assets/logo-revault.svg" width="200" class="company-logo" />
      </a>
      <div class="right-controls">
        <LanguageSwitcher />
        <button @click="logout" v-if="isAuthenticated">Sign out</button>
      </div>

    </div>

    <img alt="Vue logo" src="./assets/logo.svg" width="100" v-if="isAuthenticated">
    <HelloWorld :msg="$t('message.welcome')" v-if="isAuthenticated" />
    <HankoAuth v-if="!isAuthenticated" @onSessionCreated="onAuthenticated" />
  </div>
</template>

<script setup>
import { ref } from 'vue';  // Import ref to create reactive state
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import HelloWorld from './components/HelloWorld.vue'
import HankoAuth from './components/HankoAuth.vue'

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

.top-bar {
  display: flex;
  justify-content: space-between; /* Space between logo and controls */
  align-items: center;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
}

.company-logo {
  /* Company logo on the left */
  max-width: 200px;
}

.right-controls {
  display: flex;
  align-items: center;
}

.right-controls button {
  margin-left: 10px;
}
</style>
