export const tokenScope = [
    'identify',
    'emails.read',
    'logs.read',
    'logs.write',
    'sessions.read',
    'sessions.write'
] as const;

export type TokenScope = typeof tokenScope[number];

export interface Token {
    _id: string;
    ip: string;
    agent: string;
    scope: Array<TokenScope>;
    createdAt: string;
}