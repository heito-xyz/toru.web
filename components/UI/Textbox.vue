<template>
    <label ref="root"
        :class="['ui-textbox', { icon: Boolean(icon) }]"
    >
        <Icon :name="icon!" v-if="Boolean(icon)"/>

        <component :is="type === 'area' ? 'textarea' : 'input'"
            :name="name"
            :type="type"
            :readonly="readonly"
            :disabled="disabled"
            :required="true"
            
            @input="onInput($event)"
            @focus="$emit('focus', $event)"    
            @blur="$emit('blur', $event)"
        />

        <div class="label">{{ label }}</div>
    </label>
</template>

<script lang="ts" setup>

export type TypeInput = 'text' | 'password' | 'number' | 'area';

export type TypeLabel = 'block' | 'input';

interface InputEvent extends Event {
    target: HTMLInputElement;
}


const root = ref<HTMLElement | null>(null);


const $emit = defineEmits({
    input: (input: InputEvent) => input,
    'update:value': (value: string) => value,
    focus: (event: InputEvent) => event,
    blur: (event: InputEvent) => event
});


const props = withDefaults(defineProps<{
    name?: string;
    label: string;
    type?: TypeInput;
    value?: string;
    icon?: string;

    disabled?: boolean;
    autofocus?: boolean;
    readonly?: boolean;
}>(), {
    type: 'text',
    disabled: false,
    autofocus: false,
    readonly: false
});


const labelWidth = ref<number>(0);


let input: HTMLInputElement;


watch(() => props.label, (newValue: string, oldValue: string) => {
    if (newValue === oldValue) return;
    
    setLabelWidth();
});

watch(() => props.value, value => {
    if (!input) return;
});


function setLabelWidth() {
    setTimeout(() => {
        const label = root.value?.querySelector('.label');

        labelWidth.value = label?.scrollWidth as number;
    }, 210);
}

function onInput(event: InputEvent) {
    const value = event.target.value;

    $emit('input', event);
    $emit('update:value', value);
}


onMounted(() => {
    if (!root.value) return;

    setLabelWidth();

    input = root.value?.querySelector('input, textarea')! as HTMLInputElement;

    if (props.autofocus) input?.focus();
});

</script>

<style lang="scss" scoped>

.ui-textbox {
    cursor: text !important;
    display: flex;
    max-width: 100%;
    width: 100%;
    position: relative;
    align-items: center;
    box-sizing: border-box;
    transition: background .1s;

    &.icon {
        .label {
            left: 40px;
        }
    }

    .ui-icon {
        margin-left: 12px;
    }

    .label {
        pointer-events: none;
        max-width: calc(100% - 24px);
        position: absolute;
        left: 12px;
        color: var(--text-primary);
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition: .2s;
        user-select: none;
        overflow: hidden;
        z-index: 1;
    }

    input, textarea {
        padding: 8px 12px;
        width: 100%;
        color: var(--text-primary);
        caret-color: var(--main-color);
        border: 2px dashed var(--background-secondary);
        border-radius: 5px;
        background: var(--T);
        transition: all .2s;
        resize: vertical;
        outline: none;

        &:focus,
        &:valid {
            border-style: solid;
            mask-image: linear-gradient(transparent 2px, black 2px),
                        linear-gradient(90deg, black 6px, transparent 0),
                        linear-gradient(-90deg, black max(calc(100% - ((v-bind('labelWidth') + 6) * 1px)), 6px), transparent 0);

            & + .label {
                color: var(--text-primary);
                font-size: 12px;
                transform: translateY(calc(-100% - 2px));
            }
        }

        &::-webkit-input-placeholder {
            color: var(--placeholder-color);
        }
        &:-moz-placeholder {
            color: var(--placeholder-color);
            opacity: 1;
        }
        &::-moz-placeholder {
            color: var(--placeholder-color);
            opacity: 1;
        }
        &:-ms-input-placeholder {
            color: var(--placeholder-color);
        }
        &::-ms-input-placeholder {
            color: var(--placeholder-color);
        }
        &::placeholder {
            color: var(--placeholder-color);
        }

        &[placeholder] {
            transition: .2s;
        }


        &:disabled {
            background-color: var(--background-secondary);
            opacity: .7;
        }
    }

    textarea {
        height: auto;
        min-height: 18px;
    }
}

</style>