<template>
    <v-select
      v-model="selectedLocale"
      :items="locales"
      @update:model-value="changeLanguage"
      variant="plain"
      density="compact"
      hide-details
      item-title="text"
      item-value="value"
      class="language-select"
      :menu-props="{ contentClass: 'language-select-menu' }"
    >
      <template #selection="{ item }">
        <span class="language-flag">{{ item?.raw?.flag || selectedLocale.flag }} {{ capitalize(item.raw.value) || capitalize(selectedLocale.value) }}</span>
      </template>
      <template #item="{ item, props }">
        <v-list-item 
          v-bind="props"
          density="compact"
        >
          <v-list-item-title class="d-flex align-center">
            <span class="language-flag">{{ item.raw.flag }}</span>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-select>
  </template>
  
  <script>
    export default {
        data() {
        return {
            selectedLocale: null,
            locales: [
            { value: 'de', text: 'Deutsch', flag: '🇩🇪' },
            { value: 'en', text: 'English', flag: '🇬🇧' },
            { value: 'fr', text: 'Français', flag: '🇫🇷' },
            { value: 'it', text: 'Italiano', flag: '🇮🇹' },
            ],
        };
        },
        created() {
        const savedLocale = localStorage.getItem('userLanguage') || this.locales[0];
        console.log("saved locale: " + savedLocale);
        this.selectedLocale = savedLocale;
        },
        methods: {
            changeLanguage(newLocale) {
                if (newLocale) {
                    this.$i18n.locale = newLocale;
                    localStorage.setItem('userLanguage', newLocale);
                    console.log("locale changed to " + newLocale);
                }
            },
            capitalize(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        }
    }
  </script>
  
  <style scoped>
  .language-select {
    max-width: 120px;
  }
  
  .language-select :deep(.v-field) {
    border-radius: 0;
    box-shadow: none;
  }
  
  .language-select :deep(.v-field__input) {
    padding-top: 0;
    padding-bottom: 0;
    min-height: 35px;
  }
  
  .language-select :deep(.v-field__append-inner) {
    padding-top: 0;
  }
  
  .language-flag {
    font-size: 1.2em;
  }
  
  :deep(.language-select-menu) {
    min-width: 150px !important;
  }
  </style>