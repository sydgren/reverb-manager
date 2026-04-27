import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'reverb-manager';

const pages = import.meta.glob('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: async (name) => {
        const path = `./pages/${name}.tsx`;
        const loader = pages[path];
        if (!loader) {
            throw new Error(`Inertia page not found: ${path}`);
        }
        const module = (await loader()) as { default: unknown };
        return module.default as never;
    },
    progress: {
        color: '#00C2FF',
    },
});

initializeTheme();
