import { Link, router, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Mark } from '@/components/brand/mark';
import { Wordmark } from '@/components/brand/wordmark';
import type { SharedData } from '@/types';

interface Props {
    children: ReactNode;
}

/**
 * Top-bar layout for authenticated admin pages. No sidebar — the
 * surface area is too small to justify one. The bar holds the brand,
 * the live broadcaster status, and a sign-out action.
 */
export default function AppLayout({ children }: Props) {
    const { auth } = usePage<SharedData>().props;

    const signOut = () => {
        router.post('/logout');
    };

    return (
        <div className="bg-steel text-ink min-h-screen">
            <header className="border-rule sticky top-0 z-20 border-b backdrop-blur-md">
                <div className="bg-steel/85 mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 lg:px-8">
                    <Link
                        href="/apps"
                        className="flex shrink-0 items-center gap-2"
                        aria-label="reverb·manager"
                    >
                        <Mark className="size-5" />
                        <Wordmark size="sm" className="hidden sm:inline-flex" />
                    </Link>

                    <div className="flex items-center gap-5">
                        <span className="border-rule bg-steel-raised hidden items-center gap-2 rounded-md border px-2.5 py-1 sm:inline-flex">
                            <span className="live-dot" />
                            <span className="console-eyebrow text-ink">
                                Online
                            </span>
                        </span>

                        {auth?.user && (
                            <div className="flex items-center gap-3">
                                <span className="text-ink-muted hidden font-mono text-[12px] sm:inline">
                                    {auth.user.email}
                                </span>
                                <button
                                    onClick={signOut}
                                    className="text-ink-muted hover:text-ink font-mono text-[12px] transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1200px] px-5 py-10 lg:px-8 lg:py-14">
                {children}
            </main>
        </div>
    );
}
