import type { ToruAPI } from '.';

// * Types
import type { ResponseList } from '~/types/api';
import type { User } from '~/types/api/user';
import type { Token, TokenScope } from '~/types/api/token';

interface AuthorizeOptions {
    response_type: 'code';
    client_id: string;
    redirect_uri: string;
    scope: Array<TokenScope>;
    state?: string;
}


export default class {
    constructor(private readonly api: ToruAPI) {}


    authorize(options: AuthorizeOptions) {
        const body = new URLSearchParams(Object.keys(options).map(key => {
            let value = options[key as keyof typeof options];

            if (key === 'scope') value = (value as Array<TokenScope>).join(' ');

            return [key, value as string];
        }));

        return this.api.fetch<{
            code: string;
            state?: string;
            url: string;
        }>('/oauth/authorize', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body.toString(),
            method: 'POST',
            type: 'form'
        });
    }

    login(login: string, password: string) {
        return this.api.fetch<{
            user: User,
            accessToken: string,
            refreshToken: string
        }>('/auth/login', {
            body: {
                login,
                password
            },
            token: null,
            method: 'POST'
        });
    }

    register(username: string, email: string, password: string) {
        return this.api.fetch<string>('/auth/register', {
            body: {
                username,
                email,
                password
            },
            token: null,
            method: 'POST'
        });
    }

    logout() {
        return this.api.fetch('/auth/logout', {
            method: 'POST'
        });
    }


    refreshToken(refreshToken: string) {
        return this.api.fetch<{ access_token: string, expires_in: number, token_type: 'Bearer' }>('/auth/refresh', {
            body: {
                refreshToken
            },
            method: 'POST'
        });
    }


    getUserTokens() {
        return this.api.fetch<ResponseList<Token>>('/auth/tokens');
    }


    getUsersByTokens(...tokens: Array<string>) {
        return this.api.fetch<ResponseList<User>>('/auth/tokens', {
            body: tokens,
            method: 'POST'
        });
    }
}