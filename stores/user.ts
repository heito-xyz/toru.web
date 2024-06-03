// * Types
import type { User } from '~/types/api/user';

export interface Account {
    user: User;
    access: string;
    refresh: string;
    updatedAt: Date;
    addedAt: Date;
}


export const useUserStore = defineStore('user', () => {
    const _userId = ref<string>();
    const _accounts = ref<Array<Account>>([]);

    const { $api } = useNuxtApp();

    const $wait = useWaitStore();


    // * Getters
    const account = computed(() => _accounts.value.find(account => account.user._id === _userId.value));

    const user = computed(() => account.value?.user);

    const isAuth = computed(() => Boolean(user.value?._id));

    const avatar = computed(() => {
        if (!isAuth.value) return '';
        
        return getDefaultImage(user.value?._id!);
    });

    const accounts = computed(() => _accounts.value.map(({ user, addedAt }) => ({ ...user, addedAt })));

    
    // * Functions
    function set(userId: string) {
        _userId.value = userId;
    }

    function setTokens(refreshToken?: string, accessToken?: string) {
        if (refreshToken) {
            $cookies.set('TORUREFRESH', refreshToken, { days: 365 });
            $api.api.setToken('refresh', refreshToken);
        }

        if (accessToken) {
            $cookies.set('TORUACCESS', accessToken, { days: 7 });
            $api.api.setToken('access', accessToken);
        }
    }

    async function fetchAccounts() {
        if (process.server) return;

        const cookieAccounts = $cookies.searchByName('TORU%3A');

        if (cookieAccounts.length < 1) return;

        $wait.start('accounts:load', {
            label: 'Загрузка аккаунтов'
        });

        const list: Array<Omit<Account, 'user'> & { userId: string }> = [];

        const now = Date.now();

        for (const key of cookieAccounts) {
            let [addedAt, userId, refresh, access, updatedAt] = [key.split('%3A').pop(), ...atob($cookies.get(key)!).split(':')] as any as [number, string, string, string, number?];

            addedAt = Number(addedAt);
            updatedAt = isNaN(Number(updatedAt)) ? 0 : Number(updatedAt);
            
            const days = (now - (updatedAt || addedAt)) / 86_400_000;

            if (days > 6.5) {
                const { ok, data } = await $api.auth.refreshToken(refresh);

                if (!ok) continue;
                
                access = data.access_token;

                $cookies.delete(`TORU%3A${addedAt}`);

                $cookies.set(`TORU:${addedAt}`, btoa(`${userId}:${refresh}:${access}:${now}`), { days: 365 - days });
            }
            

            list.push({
                userId,
                refresh,
                access,
                updatedAt: new Date(updatedAt),
                addedAt: new Date(addedAt)
            });
        }

        const { ok, data } = await $api.auth.getUsersByTokens(...list.map(account => account.access));

        console.log(list, ok, data);
        

        $wait.end('accounts:load');

        if (!ok) return;

        _accounts.value = [];

        for (const user of data.results) {
            const account = list.find(account => account.userId === user._id);

            if (!account) continue;

            _accounts.value.push({
                ...account,
                user
            });

            if (account.access === $cookies.get('TORUACCESS')) {
                set(user._id);
                setTokens(account.refresh, account.access);
            }
        }

        if (accounts.value.length > 0 && !Boolean(user.value?._id)) {
            switchAccount(accounts.value[0]._id, true);
        }
    }

    function addAccount(user: User, refreshToken: string, accessToken: string, switchAccount: boolean = false) {
        if (process.server) return;

        const addedAt = Date.now();

        _accounts.value.push({
            user,
            refresh: refreshToken,
            access: accessToken,
            updatedAt: new Date(addedAt),
            addedAt: new Date(addedAt)
        });

        const value = `${user._id}:${refreshToken}:${accessToken}:${addedAt}`;

        $cookies.set(`TORU:${addedAt}`, btoa(value), { days: 365 });

        if (switchAccount) {
            setTokens(refreshToken, accessToken);
            set(user._id);
        }
    }

    function hasAccount(userId: string): boolean {
        return _accounts.value.some(({ user }) => user._id === userId || user.username === userId);
    }

    function getAccount(userId: string): Account | null {
        return _accounts.value.find(({ user }) => user._id === userId || user.username === userId) || null;
    }

    function switchAccount(userId: string, isSetTokens: boolean = false) {
        if (!hasAccount(userId)) return;

        const { user, refresh, access } = getAccount(userId)!;

        set(user._id);

        if (isSetTokens) setTokens(refresh, access);
    }

    async function fetchMe() {
        const { ok, data } = await $api.api.fetch('');

        if (!ok) return;

        set(data);
    }


    return {
        account,
        user,
        isAuth,
        avatar,
        accounts,

        set,
        fetchAccounts,
        addAccount,
        hasAccount,
        getAccount,
        switchAccount,
        fetchMe
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}