<template>
    <div :class="['account-menu', { active: showed }]">
        <img class="avatar" v-if="$user.isAuth"
            :src="$user.avatar"
            alt="Account Avatar"
            
            @click="openAccountMenu"
        >

        <div class="avatar" v-else>
            <CircleSpinner/>
        </div>
        
        <Transition name="content">
            <div class="content" ref="el" v-show="showed">
                <div class="account">
                    <span>{{ $user.user?.displayName || $user.user?.username || $user.user?._id }}</span>

                    <div></div>
                </div>

                <div class="accounts">
                    <div :class="['btn', { active: showedAccounts }]"
                        @click="showedAccounts = !showedAccounts"
                    >
                        <span>Показать другие аккаунты</span>

                        <img v-for="account of listAccounts" :key="account._id"
                            :src="getDefaultImage(account._id)"
                            alt="Account Avatar"
                        >

                        <i></i>
                    </div>

                    <AnimationHeight :showed="showedAccounts">
                        <div>
                            <ul>
                                <li v-for="account of listAccounts" :key="account._id">
                                    <img :src="getDefaultImage(account._id)" alt="Account Avatar">

                                    <div>
                                        <div>{{ account?.displayName || account?.username || account?._id }}</div>
                                        <div>@{{ account?.username }}</div>
                                    </div>
                                </li>
                            </ul>

                            <div class="btn">
                                <span>Добавить аккаунт</span>
                            </div>
                        </div>
                    </AnimationHeight>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

import CircleSpinner from '../other/CircleSpinner.vue';


const $user = useUserStore();


const el = ref<HTMLElement | null>(null);

const showed = ref(false);
const showedAccounts = ref(false);


const listAccounts = computed(() => {
    return $user.accounts.filter(({ _id }) => $user.user?._id !== _id);
});


function openAccountMenu() {
    showed.value = true;

    const close = () => {
        window.addEventListener('click', event => {
            const path = (event as any)?.path || (event.composedPath ? event.composedPath() : undefined);

            if (path && path.includes(el.value)) return close();
            
            showed.value = false;
        }, { once: true });
    }

    setTimeout(close, 10);
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
        background-color: var(--color-2);
        transition: .2s;

        &:hover {
            box-shadow: 0 0 0 3px var(--color-2);
        }

        &:active {
            box-shadow: 0 0 0 5px var(--color-2);
            transform: scale(.9);
        }
    }

    .content {
        padding: 8px;
        width: 376px;
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 1;
        border-radius: 25px;
        background-color: var(--color-1);
        box-sizing: border-box;
        transition: .2s;

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

        .accounts {
            margin-top: 12px;

            .btn {
                cursor: pointer;
                display: flex;
                padding: 12px 24px;
                align-items: center;
                transition: .2s;
                user-select: none;

                span {
                    font-size: 14px;
                }
            }

            .btn:nth-child(1) {
                border-radius: 25px;

                &:hover,
                &.active {
                    background-color: #ffffff55;
                }

                &.active {
                    border-radius: 25px 25px 0 0;

                    img {
                        pointer-events: none;
                        opacity: 0;
                    }
                }

                img {
                    margin-right: 8px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    transition: .2s;

                    &:first-of-type {
                        margin-left: auto;
                    }
                }

                i {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background-color: var(--color-2);
                }
            }

            ul {
                li {
                    cursor: pointer;
                    display: flex;
                    margin-top: 2px;
                    padding: 12px 24px;
                    align-items: center;
                    background-color: #ffffff55;
                    transition: .2s;
                    user-select: none;
                    
                    img {
                        margin-right: 8px;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        transition: .2s;
                    }

                    img + div {
                        max-width: 100%;
                        min-width: 0;
                        
                        div {
                            max-width: 100%;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;

                            &:nth-child(1) {
                                font-size: 14px;
                                font-weight: 600;
                            }

                            &:nth-child(2) {
                                font-size: 12px;
                                opacity: .7;
                            }
                        }
                    }
                }
            }

            ul + .btn {
                margin-top: 2px;
                border-radius: 0 0 25px 25px;
                background-color: #ffffff55;
            }
        }
    }
}

</style>