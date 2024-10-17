<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" v-if="isAuthenticated">
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

// Event handler function for when a session is created
const onAuthenticated = (event) => {
  console.log('session created:', event.detail);
  
  // Update the state to reflect that the user is authenticated
  isAuthenticated.value = true;
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
