import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersLight = () =>
    window.matchMedia('(prefers-color-scheme: light)').matches;

const applyTheme = (appearance: Appearance) => {
    const isLight =
        appearance === 'light' ||
        (appearance === 'system' && prefersLight());

    // Dark is the default. We add `.light` only when we want to opt out.
    document.documentElement.classList.toggle('light', isLight);
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem(
        'appearance',
    ) as Appearance | null;
    applyTheme(currentAppearance ?? 'system');
};

export function initializeTheme() {
    const savedAppearance =
        (localStorage.getItem('appearance') as Appearance | null) ?? 'system';

    applyTheme(savedAppearance);

    mediaQuery.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');

    const updateAppearance = (mode: Appearance) => {
        setAppearance(mode);
        localStorage.setItem('appearance', mode);
        applyTheme(mode);
    };

    useEffect(() => {
        const savedAppearance =
            (localStorage.getItem('appearance') as Appearance | null) ??
            'system';
        updateAppearance(savedAppearance);

        return () =>
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, []);

    return { appearance, updateAppearance };
}
