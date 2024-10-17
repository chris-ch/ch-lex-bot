<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.svg" width="100" v-if="isAuthenticated">
    <button v-if="isAuthenticated" @click="logout">Logout</button>
    <HelloWorld msg="Welcome to Your Vue.js App" v-if="isAuthenticated"/>
    <HankoAuth v-if="!isAuthenticated" @onSessionCreated="onAuthenticated" />
  </div>
</template>

<script setup>
import { ref } from 'vue';  // Import ref to create reactive state
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
</style>
