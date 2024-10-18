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
    :item-props="() => ({ props: { title: '' } })"
  >
    <template #selection="{ item }">
      <span class="language-flag w-full">
        {{ item.raw.flag }}
        {{ capitalize(item.raw.value) || capitalize(selectedLocale) }}
      </span>
    </template>
    <template #item="{ item, props }">
      <v-list-item v-bind="props" density="compact">
        <div class="d-flex justify-end w-100">
          <span class="language-flag">{{ item.raw.flag }}</span>
          <span class="ms-2">{{ capitalize(item.raw.text) }}</span>
        </div>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const selectedLocale = ref('en')

const locales = [
  { value: 'de', text: 'Deutsch', flag: '🇩🇪' },
  { value: 'en', text: 'English', flag: '🇬🇧' },
  { value: 'fr', text: 'Français', flag: '🇫🇷' },
  { value: 'it', text: 'Italiano', flag: '🇮🇹' },
]

const savedLocale = localStorage.getItem('userLanguage') || locales[0].value
console.log('saved locale: ' + savedLocale)

selectedLocale.value = savedLocale

const changeLanguage = (newLocale: string) => {
  if (newLocale) {
    i18n.locale.value = newLocale
    localStorage.setItem('userLanguage', newLocale)
    console.log('locale changed to ' + newLocale)
  }
}

const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
</script>

<style scoped>
.language-select {
  max-width: 100px;
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
  white-space: nowrap;
}

:deep(.language-select-menu) {
  min-width: 150px !important;
}

:deep(.v-list-item) {
  padding: 0 16px !important;
}

:deep(.v-list-item-title) {
  display: none;
}
</style>
