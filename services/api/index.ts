// * Types
import type { TemplateAPI, FetchOptions, Response } from '~/types/api';


export class ToruAPI implements TemplateAPI {
    private _refreshToken: string;
    private _accessToken: string;

    constructor(readonly domain: string, refreshToken: string, accessToken: string) {
        this._refreshToken = refreshToken;
        this._accessToken = accessToken;
    }


    get refreshToken() {
        return this._refreshToken;
    }

    get accessToken() {
        return this._accessToken;
    }


    setToken(type: 'refresh' | 'access', newToken: string) {
        this[`_${type}Token`] = newToken;
    }


    async fetch<ResultType = any, ErrorType = string>(uri: string, options: FetchOptions = {}): Promise<Response<ResultType, ErrorType>> {
        const {
            body = {},
            headers = {
                'Content-Type': 'application/json'
            },
            type = 'json',
            method = 'GET',
            token = this.accessToken
        } = options;

        const url = this.domain + (uri[0] === '/' ? '' : '/') + uri;

        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch(url, {
                body: method === 'GET' ? undefined : (type === 'json' ? JSON.stringify(body) : body) as any,
                headers,
                mode: 'cors',
                method
            });

            const result = await response.json() as { message?: any, result?: any };
        
            return {
                ok: response.ok,
                status: response.status,
                data: result?.message || result?.result || null,
                // name: undefined
            }
        } catch (error) {
            console.log(error);
            
            return {
                ok: false,
                status: 501,
                data: 'Server Error' as any
            }
        }
    }
}