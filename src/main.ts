import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import i18n from './i18n'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { register } from '@teamhanko/hanko-elements'
import { useUserStore } from './stores/userStore'

const revautLightTheme = {
  dark: false,
  colors: {
    background: '#EEEEEE',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#EEEEEE',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#E03F29',
    'primary-darken-1': '#B83321',
    secondary: '#A07D78',
    'secondary-darken-1': '#856763',
    error: '#F57767',
    info: '#331F1C',
    success: '#4B3835',
    warning: '#F57767',
  },
  variables: {
    'border-color': '#000000',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.6,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  },
}

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'revautLightTheme',
    themes: {
      revautLightTheme,
    },
  },
})

const hankoApi = import.meta.env.VITE_HANKO_API_URL
if (hankoApi) {
  register(hankoApi).catch((error: Error) => {
    console.error('error during Hanko API registration:', error)
  })
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')

const userStore = useUserStore()
userStore.init()
