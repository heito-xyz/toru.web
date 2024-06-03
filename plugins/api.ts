import { ToruAPI } from '~/services/api';

// * Routes
import Auth from '~/services/api/auth';
import Users from '~/services/api/users';
import Applications from '~/services/api/applications';


export default defineNuxtPlugin(async nuxtApp => {
    const { apiUrl } = nuxtApp.$config.public;

    const api = new ToruAPI(apiUrl, $cookies?.get('TORUREFRESH') || '', $cookies?.get('TORUACCESS') || '');

    return {
        provide: {
            api: {
                api,
                auth: new Auth(api),
                users: new Users(api),
                apps: new Applications(api)
            }
        }
    }
});