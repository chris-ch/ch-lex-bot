console.log("Hanko API URL:", process.env.VUE_APP_HANKO_API_URL);


import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n';

const app = createApp(App)

app.use(i18n);
app.mount('#app');
