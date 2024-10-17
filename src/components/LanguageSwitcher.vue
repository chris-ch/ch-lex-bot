<template>
    <div>
      <select v-model="selectedLocale" @change="changeLanguage">
        <option value="de">🇩🇪 Deutsch</option>
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="it">🇮🇹 Italiano</option>
      </select>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedLocale: this.$i18n.locale, // Current selected language
      };
    },
    methods: {
      changeLanguage() {
        this.$i18n.locale = this.selectedLocale; // Change the locale
      },
    },
  };
  </script>
  