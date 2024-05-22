interface PageOptions {}


type Flag = 'hide:header' | 'hide:footer';


declare module '#app/../pages/runtime/composables' {
    interface PageMeta {
        pageOptions?: PageOptions;
        flags?: Array<Flag>;
    }
}

export {}