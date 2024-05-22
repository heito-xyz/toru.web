<template>
    <div :class="['account-menu', { active: shows.has('menu') }]">
        <img class="avatar" v-if="$user.isAuth"
            :src="$user.avatar"
            alt="Account Avatar"
            
            @click="openAccountMenu"
        >

        <div class="avatar" v-else>
            <CircleSpinner/>
        </div>
        
        <Transition name="content">
            <div class="content" ref="el" v-show="shows.has('menu')">
                <div class="account">
                    <span>{{ $user.user?.displayName || $user.user?.username || $user.user?._id }}</span>

                    <div></div>
                </div>

                <div class="group">
                    <Button
                        label="Настройки"
                        icon="settings"
                    />

                    <Button
                        label="Тема"
                        :text="lightTheme ? 'Светлая' : 'Темная'"
                        :icon="lightTheme ? 'sun' : 'moon'"
                        :reverse="true"

                        @click="changeTheme"
                    />
                </div>

                <div class="accounts">
                    <Button :class="{ active: shows.has('accounts') }"
                        :label="shows.has('accounts') ? 'Свернуть' : 'Показать другие аккаунты'"
                        :iconRight="`arrow-${shows.has('accounts') ? 'up' : 'down'}`"
                        :flags="['icon-right']"

                        @click="shows[shows.has('accounts') ? 'delete' : 'add']('accounts')"
                    >
                        <template #after-content>
                            <img v-for="account of listAccounts.slice(0, listAccounts.length > 3 ? 2 : 3)" :key="account._id"
                                :src="getDefaultImage(account._id)"
                                alt="Account Avatar"
                            >

                            <div class="count" v-show="listAccounts.length > 3">+{{ listAccounts.length - 2 }}</div>
                        </template>
                    </Button>

                    <AnimationHeight :showed="shows.has('accounts')">
                        <div>
                            <ul>
                                <Button class="active" v-for="account of listAccounts" :key="account._id"
                                    :label="account?.displayName || account?.username || account?._id"
                                    :text="`@${account?.username}`"
                                    :img="getDefaultImage(account._id)"
                                    icon-right="arrow-right"

                                    @click="$user.switchAccount(account._id, true)"
                                />
                            </ul>

                            <Button
                                label="Добавить аккаунт"
                                icon="plus"

                                @click="$router.push('/login'); shows.delete('menu')"
                            />

                            <Button
                                label="Выйти из всех аккаунтов"
                                icon="exit"
                            />
                        </div>
                    </AnimationHeight>
                </div>

                <div class="language">
                    <Button :class="{ active: shows.has('lang') }"
                        label="Язык"
                        icon="language"
                        :text="'Русский'"
                        :iconRight="`arrow-${shows.has('lang') ? 'up' : 'down'}`"
                        :flags="['icon-right']"

                        @click="shows[shows.has('lang') ? 'delete' : 'add']('lang')"
                    />

                    <AnimationHeight :showed="shows.has('lang')">
                        <div>
                            <ul>
                                <Button v-for="(lang, idx) of new Array(196)" :key="idx"
                                    :label="`Language ${idx + 1}`"
                                />
                            </ul>
                        </div>
                    </AnimationHeight>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

// * Components
import Button from './Button.vue';

import CircleSpinner from '../other/CircleSpinner.vue';


const $user = useUserStore();


const el = ref<HTMLElement | null>(null);

const lightTheme = ref(cookies.get('THEME') === 'light');


const shows = ref(new Set<'menu' | 'accounts' | 'lang'>());


const listAccounts = computed(() => {
    return $user.accounts.filter(({ _id }) => $user.user?._id !== _id);
});


function openAccountMenu() {
    shows.value.add('menu')

    const close = () => {
        window.addEventListener('click', event => {
            const path = (event as any)?.path || (event.composedPath ? event.composedPath() : undefined);

            if (path && path.includes(el.value)) return close();
            
            shows.value.delete('menu');
        }, { once: true });
    }

    setTimeout(close, 10);
}


function changeTheme() {
    const isLight = lightTheme.value = !lightTheme.value;

    cookies.set('THEME', isLight ? 'light' : 'dark');

    document.querySelector('html')!.classList[isLight ? 'add' : 'remove']('light');
    document.querySelector('html')!.classList[isLight ? 'remove' : 'add']('dark');
}

</script>

<style lang="scss" scoped>

.account-menu {
    width: 42px;
    height: 42px;
    position: relative;

    &.active {
        img.avatar {
            width: 125%;
            height: 125%;
            transform: translate(-18.5px, 8px);
            transition-delay: .2s;

            &:active {
                transform: scale(.9) translate(-18.5px, 8px);
            }
        }
    }

    .avatar {
        width: 100%;
        height: 100%;
        position: relative;
        transition: .2s;
        z-index: 2;
    }

    img.avatar {
        cursor: pointer;
        border-radius: 50%;
        object-fit: cover;
        object-position: center;
        background-color: var(--background-secondary);
        transition: .2s;

        &:hover {
            box-shadow: 0 0 0 3px var(--background-secondary);
        }

        &:active {
            box-shadow: 0 0 0 5px var(--background-secondary);
            transform: scale(.9);
        }
    }

    .content {
        padding: 8px;
        width: 376px;
        max-height: calc(100vh - 16px);
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 1;
        border-radius: 25px;
        background-color: var(--background-primary);
        box-sizing: border-box;
        transition: .2s;
        overflow-x: hidden;

        &-enter-active,
        &-leave-active {
            transform: translate(8px, -8px);
            opacity: 0;
        }

        .account {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            span {
                margin-right: 8px;
                font-weight: 700;
            }

            div {
                width: 52.5px;
                height: 52.5px;
            }
        }

        .group {
            display: flex;
            margin-top: 12px;
            align-items: stretch;
        
            .btn {
                width: 100%;

                &:first-child {
                    border-top-left-radius: 25px;
                    border-bottom-left-radius: 25px;
                }

                &:last-child {
                    border-top-right-radius: 25px;
                    border-bottom-right-radius: 25px;
                }

                &:not(:last-child) {
                    margin-right: 2px
                }
            }
        }

        .accounts {
            margin-top: 8px;

            & > .btn {
                border-radius: 25px;

                &.active {
                    border-radius: 25px 25px 0 0;

                    img,
                    .count {
                        pointer-events: none;
                        opacity: 0;
                    }
                }

                img {
                    margin-right: 4px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    transition: .2s;

                    &:first-of-type {
                        margin-left: auto;
                    }
                }
                
                .count {
                    margin-right: 8px;
                    min-width: 24px;
                    height: 24px;
                    font-size: 12px;
                    text-align: center;
                    line-height: 24px;
                    border-radius: 50%;
                    background-color: var(--background-primary-alt);
                    transition: .2s;
                }
            }

            ul {
                .btn {
                    margin-top: 2px;
                }
            }

            ul + .btn,
            ul + .btn + .btn {
                margin-top: 2px;
            }

            ul + .btn + .btn {
                border-radius: 0 0 25px 25px;
            }
        }

        .language {
            margin-top: 8px;

            & > .btn {
                border-radius: 25px;

                &.active {
                    border-radius: 25px 25px 0 0;

                    .count {
                        pointer-events: none;
                        opacity: 0;
                    }
                }

                i {
                    margin-left: auto;
                    min-width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background-color: var(--color-2);
                    transition: .2s;
                }
            }

            ul {
                .btn {
                    margin-top: 2px;

                    &:last-child {
                        border-radius: 0 0 25px 25px;
                    }
                }
            }
        }
    }
}

@media (max-width: 512px) {
    .account-menu {
        &.active {
            img.avatar {
                width: 52.5px;
                height: 52.5px;
                position: fixed;
                top: 16px;
                right: 16px;
                transform: none;
                transition: all .2s, width 0s, height 0s;

                &:active {
                    transform: scale(.9);
                }
            }
        }

        .content {
            width: calc(100% - 16px);
            position: fixed;
            top: 8px;
            right: 8px;
        }
    }
}

@media (max-width: 376px) {
    .account-menu {
        .content {
            .group {
                display: block;
            
                .btn {
                    width: auto;
                    border-radius: 25px !important;

                    &:not(:last-child) {
                        margin: 0 0 8px 0;
                    }
                }
            }
        }
    }
}

</style>