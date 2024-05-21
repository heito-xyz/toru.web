export enum LogCodes {
    Auth = 0,
    Logout = 1,
    Changing = 2,
    RequestDelete = 3,
    CancelDelete = 4
}

export const userPermissions = [
    'self',
    'users'
] as const;

export type UserPermission = typeof userPermissions[number];

export interface EMail {
    email: string;
    enable: boolean;
    addedAt: Date;
}

export interface User {
    _id: string;

    username: string;
    displayName: string;

    description?: string;
    color?: string;

    emails?: Array<EMail>;
    password?: string;
    
    permissions: number;

    updatedAt: Date;
    createdAt: Date;
    expireAt?: Date;
}