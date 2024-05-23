export interface Item {
    id: number;
    name: string;
    label?: string;
    description?: string;
    createdAt?: number;
}

export const useWaitStore = defineStore('wait', () => {
    const _list = ref<Array<Item>>([]);

    
    // * Getters
    const list = computed(() => _list.value);

    
    // * Functions
    function has(id: string | number) {
        return list.value.some(item => item[typeof id === 'number' ? 'id' : 'name'] === id);
    }

    function start(name: string, options: Partial<Omit<Item, 'id' | 'name'>> = {}) {
        const newWaitItem: Item = {
            id: list.value.length,
            name,
            ...options
        };

        _list.value.push(newWaitItem);

        return {
            ...newWaitItem,

            end() {
                end(newWaitItem.id);
            }
        }
    }

    function end(item: number | string) {
        const itemIndex = list.value.findIndex(({ id, name }) => {
            return item === (typeof item === 'number' ? id : name);
        });

        if (itemIndex < 0) return false;

        _list.value.splice(itemIndex, 1);

        return true;
    }


    return {
        list,

        start,
        has,
        end
    }
});


if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWaitStore, import.meta.hot));
}