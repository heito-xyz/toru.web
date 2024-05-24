export const localeVersion = '0.0.1';

export const codes = [
    'en',
    'ru',
    'ja',
    'uk',
    'zh',
    'fr',
    'es'
] as const;

export type CodeName = typeof codes[number];


export const languages: Record<CodeName, string> = {
    en: 'English',
    ru: 'Русский',
    ja: '日本語',
    uk: 'Українська мова',
    zh: '漢語',
    fr: 'Français',
    es: 'Español'
};


export interface Locale {
    // languages: Record<CodeName, string>;

    language: string;

    welcome: string;

    guest: string;
    settings: string;
    exit: string;

    theme: string;
    themes: Record<'dark' | 'light', string>;

    addAccount: string;
    exitAllAccounts: string;

    showAllAccounts: string;
    rollUp: string;

    authorization: string;
    register: string;
    registration: string;
    username: string;
    email: string;
    password: string;
    enterLogin: string;
    or: string;
    createAccount: string;
    loginOther: string;
    repeatPassword: string;
    forgotPassword: string;
    loginAccount: string;
}