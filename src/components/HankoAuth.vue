<script setup>
import { onMounted } from "vue";
import { register } from "@teamhanko/hanko-elements";

// Define the event emitter for onSessionCreated
const emit = defineEmits(['onSessionCreated']);

const hankoApi = process.env.VUE_APP_HANKO_API_URL;

// Event handler function for when a session is created
const onAuthenticated = (event) => {
  console.log("autentication succeeded:", event);
  const userInfo = {
    authToken: event.detail.jwt,
    mistralAPIKey: undefined
  };
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
  emit('onSessionCreated', event.detail);
};

onMounted(() => {
  if (hankoApi) {
    register(hankoApi).catch((error) => {
      console.error("error during Hanko API registration:", error);
    });
  }
});
</script>

<template>
  <div>
    <hanko-auth @onSessionCreated="onAuthenticated"></hanko-auth>
  </div>
</template>
