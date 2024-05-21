export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Type = 'json' | 'form';

export interface FetchOptions {
    baseUrl?: string;
    body?: {
        [key: string | symbol]: any;
    };
    method?: Method;
    type?: Type;
    headers?: {
        [key: string | symbol]: any;
    };
    token?: string | null;
}

interface TemplateResponse<TypeOK = boolean> {
    ok: TypeOK;
    status: number;
}

interface SuccessResponse<ResultType = any> extends TemplateResponse<true> {
    data: ResultType;
}

interface ErrorResponse<ErrorType = string> extends TemplateResponse<false> {
    data: ErrorType;
}

export type Response<ResultType = any, ErrorType = string> = SuccessResponse<ResultType> | ErrorResponse<ErrorType>;

export interface ResponseList<ResultType = any> {
    total: number;
    pages: number;
    page: number;
    results: Array<ResultType>;
}


export interface TemplateAPI {
    readonly domain: string;
    readonly refreshToken: string;
    readonly accessToken: string;

    fetch<ResultType = any, ErrorType = any>(uri: string, options: FetchOptions): Promise<Response>;
}