import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Mark } from '@/components/brand/mark';
import { Wordmark } from '@/components/brand/wordmark';
import { Footer } from '@/components/footer';

interface Props {
    title: string;
    updated: string;
    children: ReactNode;
}

/**
 * Frames the public legal pages (privacy, terms) in the console theme.
 * Prose styling is applied to descendants so the page bodies stay plain
 * semantic HTML.
 */
export default function LegalLayout({ title, updated, children }: Props) {
    return (
        <div className="bg-steel text-ink flex min-h-screen flex-col">
            <Head title={title} />

            <header className="border-rule sticky top-0 z-20 border-b backdrop-blur-md">
                <div className="bg-steel/85 mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 lg:px-8">
                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-2"
                        aria-label="reverb·manager"
                    >
                        <Mark className="size-5" />
                        <Wordmark size="sm" className="hidden sm:inline-flex" />
                    </Link>
                    <span className="text-ink-muted font-mono text-[11px] tracking-[0.14em] uppercase">
                        🇪🇺 EU-based
                    </span>
                </div>
            </header>

            <main className="mx-auto w-full max-w-[760px] flex-1 px-5 py-12 lg:px-8 lg:py-16">
                <h1 className="font-display text-[34px] leading-tight italic">
                    {title}
                </h1>
                <p className="text-ink-muted mt-2 font-mono text-[12px] tracking-[0.06em]">
                    Last updated {updated}
                </p>

                <div
                    className="text-ink-soft mt-10 text-[14px] leading-[1.7] [&_a]:text-signal [&_a]:underline [&_a:hover]:opacity-80 [&_h2]:text-ink [&_h2]:font-display [&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:text-[19px] [&_h2]:not-italic [&_li]:mb-1.5 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
                >
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}
