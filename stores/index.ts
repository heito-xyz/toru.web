export const useStore = defineStore('index', () => {
    const _ready = ref<boolean>(false);

    // * Getters
    const ready = computed(() => _ready.value);

    
    // * Functions
    function setReady(bool: boolean) {
        _ready.value = bool;
    }

    return {
        ready,

        setReady
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}