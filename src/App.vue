<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" v-if="isAuthenticated">
    <HelloWorld msg="Welcome to Your Vue.js App" v-if="isAuthenticated"/>
    <HankoAuth v-if="!isAuthenticated" @onSessionCreated="onAuthenticated" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import HankoAuth from './components/HankoAuth.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    HankoAuth
  },
  data() {
    return {
      isAuthenticated: false  // Initial state: user is not authenticated
    }
  },
  methods: {
    onAuthenticated() {
      this.isAuthenticated = true;
    }
  }
}
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
