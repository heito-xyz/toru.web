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

export interface Language {
    name: string;
    emoji: string;
}


export const languages: Record<CodeName, Language> = {
    en: {
        name: 'English',
        emoji: '🇬🇧'
    },
    ru: {
        name: 'Русский',
        emoji: '🇷🇺'
    },
    ja: {
        name: '日本語',
        emoji: '🇯🇵'
    },
    uk: {
        name: 'Українська мова',
        emoji: '🇺🇦'
    },
    zh: {
        name: '漢語',
        emoji: '🇨🇳'
    },
    fr: {
        name: 'Français',
        emoji: '🇫🇷'
    },
    es: {
        name: 'Español',
        emoji: '🇪🇸'
    }
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
    authentication: string;
    register: string;
    registration: string;
    username: string;
    email: string;
    password: string;
    enterLogin: string;
    or: string;
    and: string;
    createAccount: string;
    loginOther: string;
    repeatPassword: string;
    forgotPassword: string;
    loginAccount: string;

    integrations: string;
    publicProfile: string;
    account: string;
    appearance: string;
    notifications: string;
    sessions: string;
    applications: string;

    name: string;
    displayName: string;
    description: string;

    createApp: string;
}