<script setup lang="ts">
import ChatBot from '../components/ChatBot.vue'
</script>

<template>
  <!-- App Logo -->
  <v-row justify="center">
    <v-col cols="auto">
      <img alt="Judicia" src="../assets/logo.svg" width="100" />
    </v-col>
  </v-row>

  <!-- Chat Bot -->
  <v-row justify="center">
    <v-col cols="12">
      <ChatBot :showUnknownError="'true'" />
    </v-col>
  </v-row>
</template>
