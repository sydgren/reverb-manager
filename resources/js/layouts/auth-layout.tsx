import type { ReactNode } from 'react';
import { Mark } from '@/components/brand/mark';
import { Wordmark } from '@/components/brand/wordmark';

/**
 * Centered card on dark steel — used for login + magic-link confirmation.
 * The page itself supplies the text content; this just frames it.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-steel text-ink relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
            {/* Faint scan-line texture in the background — never a focal
                element, just gives the page some depth */}
            <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />

            <div className="relative w-full max-w-[420px]">
                <div className="mb-12 flex items-center justify-center gap-2.5">
                    <Mark className="size-6" />
                    <Wordmark size="md" />
                </div>

                <div className="bg-steel-raised border-rule rounded-md border p-8">
                    {children}
                </div>

                <p className="text-ink-muted mt-6 text-center font-mono text-[11px] tracking-[0.14em] uppercase">
                    Self-hosted broadcaster · v0.1
                </p>
            </div>
        </div>
    );
}
