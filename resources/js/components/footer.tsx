import { Link } from '@inertiajs/react';

/**
 * Shared footer — carries the EU-based badge and links to the legal pages.
 * GDPR transparency lives one click away from every screen.
 */
export function Footer({ className = '' }: { className?: string }) {
    return (
        <footer
            className={`border-rule-soft text-ink-muted border-t font-mono text-[11px] tracking-[0.04em] ${className}`}
        >
            <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row lg:px-8">
                <span className="flex items-center gap-2">
                    <span>© {new Date().getFullYear()} reverb·manager</span>
                    <span className="text-ink-soft">·</span>
                    <span aria-label="EU-based">🇪🇺 EU-based</span>
                </span>
                <nav className="flex items-center gap-5">
                    <Link
                        href="/privacy"
                        className="hover:text-ink transition-colors"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="/terms"
                        className="hover:text-ink transition-colors"
                    >
                        Terms
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
