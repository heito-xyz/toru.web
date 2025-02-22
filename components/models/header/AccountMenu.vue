<template>
    <div :class="['account-menu', { active: shows.has('menu') }]">
        <Image class="avatar" v-if="$user.isAuth || !isLogin"
            :src="isLogin ? $user.avatar : getDefaultImage('guest', { type: 'marble' })"
            alt="Account Avatar"

            @click="shows.has('menu') ? shows.delete('menu') : openAccountMenu()"
        />

        
        <div class="avatar loading" v-else>
            <CircleSpinner/>
        </div>

        <Transition name="content">
            <div class="content" ref="el" v-show="shows.has('menu')">
                <div class="account">
                    <span>{{ $user.user?.displayName || $user.user?.username || $user.user?._id || $t('guest') }}</span>

                    <div></div>
                </div>

                <div>
                    <div class="group">
                        <Button v-if="isLogin"
                            :label="$t('settings')"
                            icon="settings"
                            
                            @click="$router.push('/settings'); shows.delete('menu')"
                        />
    
                        <Button v-else
                            :label="$t('enterLogin')"
                            icon="login"
    
                            @click="$router.push('/login'); shows.delete('menu')"
                        />
    
                        <Button
                            :label="$t('theme')"
                            :text="$t(`themes.${lightTheme ? 'light' : 'dark'}`)"
                            :icon="lightTheme ? 'sun' : 'moon'"
                            :reverse="true"
    
                            @click="changeTheme"
                        />

                        <template v-if="isLogin && listAccounts.length === 0">
                            <Button label="Войти в"
                                text="другой аккаунт"
                                icon="plus"

                                @click="$router.push('/login'); shows.delete('menu')"
                            />

                            <Button :label="$t('exit')"
                                icon="exit"

                                @click="shows.delete('menu')"
                            />
                        </template>
                    </div>
    
                    <div class="accounts">
                        <Button :class="{ active: shows.has('accounts') }" v-if="isLogin && listAccounts.length > 0"
                            :label="$t(shows.has('accounts') ? 'rollUp' : 'showAllAccounts')"
                            :iconRight="`arrow-${shows.has('accounts') ? 'up' : 'down'}`"
                            :flags="['icon-right']"
    
                            @click="shows[shows.has('accounts') ? 'delete' : 'add']('accounts')"
                        >
                            <template #after-content>
                                <Image v-for="account of listAccounts.slice(0, listAccounts.length > 3 ? 2 : 3)" :key="account._id"
                                    :src="getDefaultImage(account._id)"
                                    alt="Account Avatar"
                                />
    
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
                                    :label="$t('addAccount')"
                                    icon="plus"
    
                                    @click="$router.push('/login'); shows.delete('menu')"
                                />
    
                                <Button
                                    :label="$t('exitAllAccounts')"
                                    icon="exit"
                                />
                            </div>
                        </AnimationHeight>
                    </div>
    
                    <div class="language">
                        <Button :class="{ active: shows.has('lang') }"
                            :label="$t('language')"
                            icon="language"
                            :text="languages[$lang.code.value].emoji + ' ' + languages[$lang.code.value].name"
                            :iconRight="`arrow-${shows.has('lang') ? 'up' : 'down'}`"
                            :flags="['icon-right']"
    
                            @click="shows[shows.has('lang') ? 'delete' : 'add']('lang')"
                        />
    
                        <AnimationHeight :showed="shows.has('lang')">
                            <div>
                                <ul>
                                    <Button v-for="langCodeName of $lang.codes" :key="langCodeName"
                                        :label="languages[langCodeName].emoji + ' ' + languages[langCodeName].name"
                                        icon-right="arrow-right"

                                        @click="$lang.set(langCodeName)"
                                    />
                                </ul>
                            </div>
                        </AnimationHeight>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

import { languages } from '~/types/locale';

// * Components
import Button from './Button.vue';

import CircleSpinner from '../other/CircleSpinner.vue';


const { $lang } = useNuxtApp();

const $user = useUserStore();


const el = ref<HTMLElement | null>(null);

const lightTheme = ref($cookies.get('THEME') === 'light');


const shows = ref(new Set<'menu' | 'accounts' | 'lang'>());


const isLogin = computed(() => Boolean($user?.user?._id));

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

    $cookies.set('THEME', isLight ? 'light' : 'dark');

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
        .avatar {
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

        &.icon {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                i {
                    color: var(--color-primary);
                }
            }

            i {
                font-size: 24px;
                transition: .2s;
            }
        }
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
        padding: 8px 4px 8px 8px;
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
        overflow: hidden;

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
                margin-right: 16px;
                font-weight: 700;
            }

            div {
                width: 52.5px;
                height: 52.5px;
            }
        }

        .account + div {
            margin-top: 12px;
            max-height: calc(100vh - 96px);
            border-radius: 25px;
            overflow-x: hidden;
            overflow-y: scroll;
        }

        .group {
            display: grid;
            border-radius: 25px;
            grid-template-columns: repeat(2, 1fr);
            gap: 2px;
            overflow: hidden;
        
            .btn {
                box-sizing: border-box;

                &:nth-child(2n + 1):not(:has(+ .btn)) {
                    grid-column: span 2;
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