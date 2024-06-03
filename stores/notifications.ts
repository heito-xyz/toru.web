import type { Notification, NotificationTemplate, Group } from '~/types/stores/notifications';

type NID = number | string;


export const useNotificationsStore = defineStore('notifications', () => {
    const _list = ref<Array<Notification>>([]);
    const _active = ref<boolean>(false);

    const _count = ref<number>(1);
    const sizes = new Map<number, number>();

    const _groups = ref<Record<string, Partial<Group>>>({});

    

    
    // * Getters
    const list = computed(() => _list.value.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1));

    const isActive = computed(() => _active.value);

    const groups = computed(() => {
        const groups: Record<string, Partial<Group> & { list: Array<Notification> }> = {};

        for (const name in _groups.value) {
            groups[name] = {
                ..._groups.value[name],
                list: list.value.filter(notification => notification?.group === name).sort((a, b) => {
                    return a.createdAt < b.createdAt ? 1 : -1;
                })
            }
        }

        return groups;
    });

    
    // * Functions
    function getIndex(nid: NID) {
        return list.value.findIndex(notification => {
            return notification[typeof nid === 'number' ? 'id' : 'name'] === nid;
        });
    }

    function updateMaxCount() {
        if (process.server) return;

        let max = window.innerHeight - 128,
            count = 0;

        const ids = [...sizes.keys()].sort((a, b) => a < b ? 1 : -1);

        for (const id of ids) {
            const size = sizes.get(id)!;

            max -= size;

            if (max < 1) return _count.value = count || 1;

            count++;
        }

        _count.value = count + 1;
    }

    function push(notification: Partial<NotificationTemplate>, hidden: boolean = false): Notification {
        const newNotification: Notification = {
            ...notification,
            id: _list.value.length,
            createdAt: Date.now(),
            hidden,

            remove() {
                remove(newNotification.id);
            },
            hide() {
                hide(newNotification.id);
            }
        }

        _list.value.push(newNotification);

        updateMaxCount();

        return newNotification;
    }

    function remove(...nids: Array<NID>) {
        for (const nid of nids) {
            const index = getIndex(nid);

            if (index < 0) continue;

            _list.value.splice(index, 1);
        }
    }

    function hide(...nids: Array<NID>) {
        for (const nid of nids) {
            const index = getIndex(nid);

            if (index < 0) continue;

            _list.value[index].hidden = true;
        }
    }

    function searchByName(name: string): Notification | null {
        const index = getIndex(name);

        if (index < 0) return null;

        return list.value[index];
    }


    return {
        list,
        isActive,
        maxCount: computed(() => _count.value),
        groups,

        setActive(bool: boolean) {
            _active.value = bool;
        },
        push,
        has(nid: NID) {
            const index = getIndex(nid);

            return index > -1;
        },
        get(nid: NID) {
            const index = getIndex(nid);

            if (index < 0) return null;

            return list.value[index];
        },
        remove,
        hide,
        searchByName,

        setMaxCount(count: number) {
            _count.value = count;
        },

        getSizes() {
            return sizes;
        },
        setSize(id: number, size: number) {
            sizes.set(id, size);

            updateMaxCount();
        },
        removeSize(id: number) {
            sizes.delete(id);

            updateMaxCount();
        },

        createGroup(name: string, group: Partial<Omit<Group, 'updatedAt'>>) {
            _groups.value[name] = group;
        },
        hasGroup(name: string) {
            return _groups.value[name] !== undefined;
        }
    }
});


if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot));
}