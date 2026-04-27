import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const isBrowser = (): boolean => typeof window !== 'undefined';

const prefersLight = (): boolean =>
    isBrowser() &&
    window.matchMedia('(prefers-color-scheme: light)').matches;

const applyTheme = (appearance: Appearance): void => {
    if (!isBrowser()) {
        return;
    }
    const isLight =
        appearance === 'light' ||
        (appearance === 'system' && prefersLight());

    document.documentElement.classList.toggle('light', isLight);
};

const getMediaQuery = (): MediaQueryList | null =>
    isBrowser()
        ? window.matchMedia('(prefers-color-scheme: light)')
        : null;

const handleSystemThemeChange = (): void => {
    if (!isBrowser()) {
        return;
    }
    const currentAppearance = localStorage.getItem(
        'appearance',
    ) as Appearance | null;
    applyTheme(currentAppearance ?? 'system');
};

export function initializeTheme(): void {
    if (!isBrowser()) {
        return;
    }
    const savedAppearance =
        (localStorage.getItem('appearance') as Appearance | null) ?? 'system';

    applyTheme(savedAppearance);
    getMediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');

    const updateAppearance = (mode: Appearance) => {
        setAppearance(mode);
        if (isBrowser()) {
            localStorage.setItem('appearance', mode);
        }
        applyTheme(mode);
    };

    useEffect(() => {
        const savedAppearance =
            (localStorage.getItem('appearance') as Appearance | null) ??
            'system';
        updateAppearance(savedAppearance);

        return () =>
            getMediaQuery()?.removeEventListener(
                'change',
                handleSystemThemeChange,
            );
    }, []);

    return { appearance, updateAppearance };
}
