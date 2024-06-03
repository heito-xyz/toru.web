import { createI18n } from 'vue-i18n';

// * Types
import { localeVersion, codes, type Locale, type CodeName } from '~/types/locale';

// * Locales
import templateLocale from '~/locales/template';


const localeKeys = Object.keys(templateLocale) as Array<keyof Locale>;


export default defineNuxtPlugin(async ({ vueApp }) => {
    const messages: Partial<Record<CodeName, Locale>> = {
        en: templateLocale
    };

    let currentCode = ($cookies.get('LANG') || 'en') as CodeName;

    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: currentCode,
        availableLocales: [],
        messages: messages as any
    });

    vueApp.use(i18n);


    // * Functions
    async function set(code: CodeName) {
        if (!codes.includes(code)) return;
        
        currentCode = i18n.global.locale.value = code;

        $cookies.set('LANG', code);
    }

    async function init() {
        if (process.server) return;

        const localeFiles = await import.meta.glob('~/locales/*.locale.json');

        for (const filePath in localeFiles) {
            try {
                const code = filePath.replace(/\/\w+\/(.*).locale.json/, '$1') as CodeName;

                const locale = (await localeFiles[filePath]() as { default: Locale }).default;

                i18n.global.messages.value[code] = locale;
            } catch (error) {
                console.error('Language pack error:', error);
                
                continue;
            }

            if (!codes.includes(currentCode)) await set('en');
        }
    }
    

    return {
        provide: {
            lang: {
                code: computed(() => i18n.global.locale.value as CodeName),
                codes,
                init,
                set
            }
        }
    }
});