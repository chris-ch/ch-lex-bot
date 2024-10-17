import { createI18n } from 'vue-i18n';

// Import language JSON files
import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import it from './locales/it.json';

// Create an i18n instance with the languages and default locale
const i18n = createI18n({ locale: 'en', // Set the default locale
    fallbackLocale: 'en', // Fallback language if the chosen language has missing translations
    messages: { en, de, fr, it } });

export default i18n;
