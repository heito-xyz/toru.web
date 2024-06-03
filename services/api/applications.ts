import type { ToruAPI } from '.';

// * Types
import type { ResponseList } from '~/types/api';
import type { Application } from '~/types/api/application';


export default class {
    constructor(private readonly api: ToruAPI) {}


    list() {
        return this.api.fetch<ResponseList<Application>>('/applications');
    }


    create(name: string, displayName?: string, description?: string) {
        return this.api.fetch<Application>('/applications', {
            body: {
                name,
                displayName,
                description
            },
            method: 'POST'
        });
    }


    get(appId: string) {
        return this.api.fetch<Application>(`/applications/${appId}`);
    }


    update(appId: string, body: Partial<Pick<Application, 'displayName' | 'description' | 'redirectUris'>>) {
        return this.api.fetch<Application>(`/applications/${appId}`, {
            body,
            method: 'PATCH'
        });
    }
}