<script setup>
import { onMounted } from "vue";
import { register } from "@teamhanko/hanko-elements";

const hankoApi = process.env.VUE_APP_HANKO_API_URL;
console.log("Hanko API URL:", hankoApi);

// Event handler function for when a session is created
const onAuthenticated = (event) => {
  console.log("session created:", event.detail);
  // You can handle the session creation logic here, such as storing user info
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
