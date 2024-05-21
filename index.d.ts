interface PageOptions {}


type Flag = 'hide-footer' | 'hide-header';


declare module '#app/../pages/runtime/composables' {
    interface PageMeta {
        pageOptions?: PageOptions;
        flags?: Array<Flag>;
    }
}

export {}