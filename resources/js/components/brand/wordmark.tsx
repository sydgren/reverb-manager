import { cn } from '@/lib/utils';

interface WordmarkProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizes = {
    sm: { text: 'text-[13px]', dot: 'size-[6px]', tracking: '-0.01em' },
    md: { text: 'text-[15px]', dot: 'size-[7px]', tracking: '-0.01em' },
    lg: { text: 'text-[20px]', dot: 'size-[9px]', tracking: '-0.015em' },
};

/**
 * `reverb·manager` — middle dot is a small cyan square,
 * mirroring the centered-square mark of the brand.
 */
export function Wordmark({ className, size = 'md' }: WordmarkProps) {
    const s = sizes[size];

    return (
        <span
            className={cn(
                'text-ink inline-flex items-center font-mono font-semibold leading-none',
                s.text,
                className,
            )}
            style={{ letterSpacing: s.tracking }}
        >
            <span>reverb</span>
            <span
                className={cn(
                    'bg-signal mx-[3px] inline-block translate-y-[1px] rounded-[1.5px]',
                    s.dot,
                )}
            />
            <span>manager</span>
        </span>
    );
}
