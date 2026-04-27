import { Head, Link } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';

export default function MagicLinkSent() {
    return (
        <AuthLayout>
            <Head title="Check your email" />

            <div className="text-center">
                <div className="mb-5 flex justify-center">
                    <span className="live-dot" />
                </div>
                <h1 className="font-display text-[28px] leading-tight italic">
                    Check your email.
                </h1>
                <p className="text-ink-soft mt-3 text-[13px] leading-[1.7]">
                    If an account exists for that address, a sign-in link is on
                    its way. The link expires in 15 minutes.
                </p>

                <Link
                    href="/login"
                    className="text-ink-muted hover:text-signal mt-8 inline-block font-mono text-[12px] tracking-[0.14em] uppercase transition-colors"
                >
                    ← Try a different email
                </Link>
            </div>
        </AuthLayout>
    );
}
