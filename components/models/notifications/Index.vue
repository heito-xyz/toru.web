<template>
    <div class="notifications">
        <Transition name="background">
            <div class="background" v-if="$notifications.isActive"
                @click="$notifications.setActive(false)"
            ></div>
        </Transition>

        <Transition name="new">
            <div class="content new" v-show="!$notifications.isActive">
                <div class="plus" v-if="!$notifications.isActive && listActiveNotifications.length > 7">
                    +{{ listActiveNotifications.length - 7 }}
                </div>

                <TransitionGroup tag="ul" name="notification"
                    @enter="enterNotification"
                >
                    <Notification v-for="notification of listActiveNotifications" :key="notification.id"
                        :id="String(notification.id)"

                        :notification="notification"
                        :show-buttons="true"
                        :show-options="true"

                        @click="openPanel"

                        @hide="hides[hides.has(notification.id) ? 'delete' : 'add'](notification.id)"
                    />
                </TransitionGroup>

                <AnimationHeight :showed="hides.size > 0">
                    <div class="hides" @click="hides.clear()">Показать все скрытые уведомления</div>
                </AnimationHeight>
            </div>
        </Transition>

        <Transition name="panel">
            <div class="panel" v-show="$notifications.isActive">
                <header>
                    <Icon name="bell"/>

                    <span>Notifications</span>

                    <Icon name="close"
                        @click="$notifications.setActive(false)"
                    />
                </header>

                <ul>
                    <div class="alert" v-if="$notifications.list.length < 1">Тут ничего нет</div>

                    <template v-if="listFixedNotifications.length > 0">
                        <div>
                            <Notification v-for="notification of $notifications.list.filter(n => n?.mode === 'fixed')" :key="notification.id"
                                :notification="notification"
                                :show-buttons="true"
                            />
                        </div>

                        <div style="margin: 8px; border-top: 1px dashed var(--color-primary);"></div>
                    </template>

                    <div>
                        <template v-for="({ type, item }, idx) of listNotifications" :key="idx">
                            <Group v-if="type === 'group'"
                                :name="item.name!"
                                :group="item"
                            />
        
                            <Notification v-else-if="type === 'notification'"
                                :notification="(item as any)"
                                :show-buttons="true"
                            />
                        </template>
                    </div>
                </ul>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

import Group from './Group.vue';
import Notification from './Card.vue';


const $user = useUserStore();
const $notifications = useNotificationsStore();


const hides = ref(new Set<number>());


const listActiveNotifications = computed(() => {
    return $notifications.list.filter(notification => {
        return !hides.value.has(notification.id) && (notification.mode === 'fixed' || !notification?.hidden);
    }).sort((a, b) => a.mode === 'fixed' ? 1 : (a.createdAt > b.createdAt ? 1 : -1));
});

const listFixedNotifications = computed(() => {
    return $notifications.list.filter(n => n?.mode === 'fixed');
});

const listNotifications = computed(() => {
    const groups = Object.keys($notifications.groups).filter(g => {
        return $notifications.groups[g].list.length > 0;
    });

    return [
        ...$notifications.list.filter(notification => notification?.mode !== 'fixed').map(n => ({
            type: 'notification',
            item: n,
            date: n.createdAt
        })),
        ...groups.map(name => {
            const group = $notifications.groups[name];

            return {
                type: 'group',
                item: {
                    name,
                    ...group
                },
                date: group.list[0]?.createdAt || 0
            }
        })
    ].sort((a, b) => a.date < b.date ? 1 : -1);
});


function openPanel() {
    $notifications.setActive(true);

    listActiveNotifications.value.forEach(n => {
        if (n?.mode === 'fixed') return;

        n?.hide();
    });
}

function enterNotification(element: Element, done: () => void) {
    const id = Number(element.id);
    const notification = $notifications.get(id);

    $notifications.setSize(id, element.scrollHeight + 2);

    done();

    if (!notification) return;

    if ($notifications.isActive && notification.mode !== 'fixed') return notification.hide();

    if (notification.mode !== 'fixed') setTimeout(() => {
        notification.hide();

        $notifications.removeSize(id);
    }, 7000);
}

</script>

<style lang="scss" scoped>

.notification-enter-active,
.notification-leave-active {
    margin: 0;
    padding: 0;
    max-height: 0px;
    height: 0px;
    transform: scale(0.8);
    opacity: 0;
}

.notifications {
    .background {
        pointer-events: all;
        width: 100dvw;
        height: 100dvh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #00000055;
        transition: .2s;
        z-index: 192;

        &-enter-active,
        &-leave-active {
            opacity: 0;
        }
    }

    .panel {
        pointer-events: all;
        display: flex;
        width: 376px;
        height: 100vh;
        position: fixed;
        right: 0;
        bottom: 0;
        flex-direction: column;
        background-color: var(--background-primary);
        transition: all .5s;
        z-index: 193;

        &-enter-active,
        &-leave-active {
            transform: translateX(100%);
            opacity: 0;
        }

        header {
            display: flex;
            padding: 12px 24px;
            align-items: center;
            border-bottom: 2px dashed var(--color-primary);
            box-sizing: border-box;
            
            span {
                margin: 0 8px;
                width: 100%;
                font-size: 18px;
                font-weight: 600;
            }

            span + i {
                cursor: pointer;
                color: var(--text-secondary);
                transition: .2s;

                &:hover {
                    color: red;
                }
            }
        }

        ul {
            height: 100%;
            min-height: 0;
            padding: 12px;
            overflow-x: hidden;

            .alert {
                margin-top: 10%;
                color: var(--text-secondary);
                font-size: 14px;
                font-weight: 700;
                text-transform: uppercase;
                text-align: center;
            }

            :deep(.group) {
                transition: .2s;

                &.active {
                    margin: 8px 0;

                    & + .notification {
                        border-top-left-radius: 15px;
                        border-top-right-radius: 15px;
                    }
                    & + :deep(.group) {
                        header {
                            border-top-left-radius: 15px;
                            border-top-right-radius: 15px;
                        }
                    }
                }

                &:not(.active) header {
                    border-radius: 0;
                }

                &.active header {
                    border-radius: 15px 15px 0 0 !important;
                }
            }
        }
    }

    .notification,
    :deep(.group) {
        border-radius: 0;
    
        &:first-child,
        &:first-child header {
            border-top-left-radius: 15px !important;
            border-top-right-radius: 15px !important;
        }
    
        &:last-child,
        &:last-child header {
            border-bottom-left-radius: 15px !important;
            border-bottom-right-radius: 15px !important;
        }
    
        &:not(:last-child) {
            margin-bottom: 2px;
        }

        &:has(+ .group.active) {
            border-bottom-left-radius: 15px !important;
            border-bottom-right-radius: 15px !important;
        }
    }

    .new {
        width: 376px;
        position: fixed;
        right: 2vh;
        bottom: 2vh;
        transition: .2s;
        z-index: 106;

        &-enter-active,
        &-leave-active {
            transform: translateY(50%);
            opacity: 0;
        }

        .hides {
            cursor: pointer;
            margin-top: 4px;
            color: var(--text-secondary);
            font-size: 12px;
            font-weight: 600;
            text-align: right;
            transition: .2s;

            &:hover {
                color: var(--text-primary);
            }
        }
    }
}

</style>