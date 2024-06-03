import type { User } from './user';


export enum LogCodes {
    Update = 100
}

export enum NotificationCodes {}

export const appPermissions = [
    'owner',
    'invated',
    'member',
] as const;

export type AppPermission = typeof appPermissions[number];


export interface Member {
    member: User;
    permissions: number;

    updatedAt?: Date;
    joinedAt?: Date;
}

export interface Application<TypeMember = number> {
    _id: string;

    name?: string;
    displayName: string;

    description?: string;

    members: TypeMember;

    secret: string;

    redirectUris: Array<string>;

    updatedAt: Date;
    createdAt: Date;
}