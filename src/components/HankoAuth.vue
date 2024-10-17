<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { register } from "@teamhanko/hanko-elements";

const hankoApi = process.env.VUE_APP_HANKO_API_URL;

const router = useRouter();

const redirectAfterLogin = () => {
  // successfully logged in, redirect to a page in your application
  router.push("/dashboard");
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
    <hanko-auth v-on:onSessionCreated="redirectAfterLogin"></hanko-auth>
  </div>
</template>
