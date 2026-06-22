import { cn } from '@/lib/utils';

interface WordmarkProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizes = {
    sm: { text: 'text-[13px]', tracking: '-0.01em' },
    md: { text: 'text-[15px]', tracking: '-0.01em' },
    lg: { text: 'text-[20px]', tracking: '-0.015em' },
};

/**
 * `reverberberb` — a pun on reverb echoing (reverb · erb · erb).
 * The two trailing "erb" syllables fade out like a decaying echo tail.
 * The cyan accent lives in the adjacent <Mark />, so the wordmark stays tonal.
 */
export function Wordmark({ className, size = 'md' }: WordmarkProps) {
    const s = sizes[size];

    return (
        <span
            className={cn('text-ink inline-flex items-baseline font-mono leading-none font-semibold', s.text, className)}
            style={{ letterSpacing: s.tracking }}
        >
            <span>reverb</span>
            <span className="text-ink-soft">erb</span>
            <span className="text-ink-muted">erb</span>
        </span>
    );
}
