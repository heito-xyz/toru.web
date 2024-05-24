import fs from 'node:fs';
import { resolve } from 'node:path';

import {
    codes,
    languages,
    type CodeName,
    type Locale
} from '~/types/locale';

import templateLocale from '~/locales/template';


const { API_TRANSLATE_URL = 'https://translate.heito.xyz' } = process.env;


async function fetchLanguage(code: CodeName) {
    try {
        const res = await fetch(`${API_TRANSLATE_URL}/text`, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lang: languages[code],
                data: templateLocale
            }),
            method: 'POST',
            mode: 'cors'
        });

        if (!res.ok) return null;

        const { result } = await res.json() as { result: Locale };

        if (!result) return null;

        return result;
    } catch (error) {
        console.log(error);
        
        return null;
    }
}


for (const code of codes.filter(code => code !== 'en')) {
    console.log(`Downloading a language pack: ${languages[code]}`);
    
    const result = await fetchLanguage(code);

    console.log(`Installing the language pack: ${languages[code]}`);
    
    fs.writeFileSync(resolve(__dirname, `../locales/${code}.locale.json`), JSON.stringify(result));
}