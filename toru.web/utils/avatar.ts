export type TypeAvatar = 'marble' | 'beam' | 'pixel' | 'sunset' | 'bauhaus' | 'ring';

export interface DefaultImageOptions {
    type?: TypeAvatar;
    size?: number;
    square?: boolean;
    png?: boolean;
    colors?: Array<string>;
}

export const regexHexColor = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export const defaultColors = [
    'ffe5ec',
    'ffc2d1',
    'ffb3c6',
    'ff8fab',
    'fb6f92'
];

export function getDefaultImage(name: string, options: DefaultImageOptions = {}): string {
    const {
        type = 'beam',
        size = 512,
        square = true,
        png = false,
        colors = defaultColors
    } = options;

    const url = new URL(`https://avatars.heito.xyz/${type}/${size}/${name}`);

    url.searchParams.append('colors', colors.join(','));

    if (square) url.searchParams.append('square', '');
    if (png) url.searchParams.append('png', '');

    return url.toString();
}