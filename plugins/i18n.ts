import { createI18n } from 'vue-i18n';

// * Types
import { localeVersion, codes, type Locale, type CodeName } from '~/types/locale';

// * Locales
import en from '~/locales/en';


const localeKeys = Object.keys(en) as Array<keyof Locale>;


export default defineNuxtPlugin(async ({ vueApp, $config: { public: { apiTranslateUrl } } }) => {
    const $wait = useWaitStore();

    const messages: Partial<Record<CodeName, Locale>> = {
        en
    };

    let currentCode = (cookies.get('LANG') || 'en') as CodeName;

    const readyLangs = new Map<CodeName, string>([['en', localeVersion]]);

    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: currentCode,
        availableLocales: [],
        messages: messages as any
    });

    vueApp.use(i18n);


    // * Functions
    async function fetchLanguage(code: CodeName) {
        try {
            const res = await fetch(`${apiTranslateUrl}/text`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lang: en.languages[code],
                    data: en
                }),
                method: 'POST',
                mode: 'cors'
            });
    
            if (!res.ok) return null;
    
            const { result } = await res.json() as { result: Locale & { _v: string } };

            if (!result || !result[localeKeys[Math.floor(Math.random() * localeKeys.length)]]) return null;
    
            result._v = localeVersion;
    
            return result;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    async function loadLanguage(code: CodeName) {
        $wait.start('language:load', {
            label: `${readyLangs.has(code) ? 'Обновление' : 'Загрузка'} языкового пакета ${en.languages[code]}`
        });

        const result = await fetchLanguage(code);

        $wait.end('language:load');

        if (!result) return;

        localStorage.setItem(`lang:${code}`, JSON.stringify(result));

        i18n.global.messages.value[code] = result;

        readyLangs.set(code, result._v);
    }

    async function set(code: CodeName) {
        if (!codes.includes(code)) return;
        
        const isCurrentVersion = readyLangs.get(code) === localeVersion;

        if (!readyLangs.has(code) || !isCurrentVersion) await loadLanguage(code);
        
        currentCode = i18n.global.locale.value = code;

        cookies.set('LANG', code);
    }

    async function init() {
        if (process.server) return;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            if (!key?.includes('lang:')) continue;

            const code = key.split(':')[1] as CodeName;

            try {
                const data = JSON.parse(localStorage[key]) as Locale & { _v: string };

                i18n.global.messages.value[code] = data;

                readyLangs.set(code, data._v);
            } catch (_) {}
        }

        if (!codes.includes(currentCode) || !readyLangs.has(currentCode)) await set('en');

        if (readyLangs.get(currentCode) !== localeVersion) await loadLanguage(currentCode);
    }


    return {
        provide: {
            lang: {
                code: computed(() => i18n.global.locale.value),
                codes,
                init,
                set
            }
        }
    }
});