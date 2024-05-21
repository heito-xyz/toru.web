import type { ToruAPI } from '.';

// * Types
import type { Application } from '~/types/api/application';


export default class {
    constructor(private readonly api: ToruAPI) {}


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
}