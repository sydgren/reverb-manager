import { cn } from '@/lib/utils';

export function Mark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            className={cn('text-ink', className)}
            aria-hidden="true"
        >
            <rect
                x="3"
                y="3"
                width="26"
                height="26"
                rx="6"
                stroke="currentColor"
                strokeWidth="2.5"
            />
            <rect
                x="11"
                y="11"
                width="10"
                height="10"
                rx="1.5"
                fill="var(--signal)"
            />
        </svg>
    );
}
