import type { ToruAPI } from '.';

// * Types
import type { User } from '~/types/api/user';


export default class {
    constructor(private readonly api: ToruAPI) {}


    me() {
        return this.api.fetch<User>('/users/me');
    }
}