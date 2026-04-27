import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CreateApp() {
    const form = useForm<{
        name: string;
        allowed_origins: string;
    }>({
        name: '',
        allowed_origins: '*',
    });

    return (
        <AppLayout>
            <Head title="New app" />

            <div className="mx-auto max-w-[640px]">
                <div className="mb-10">
                    <p className="console-eyebrow mb-2">
                        Apps · New
                    </p>
                    <h1 className="font-display text-[40px] leading-[1.05] tracking-tight italic">
                        New app.
                    </h1>
                    <p className="text-ink-soft mt-3 text-[13px] leading-[1.6]">
                        We'll generate the key, secret, and app ID. The secret
                        is shown once on the next screen — copy it before you
                        leave.
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.transform((data) => ({
                            ...data,
                            allowed_origins: data.allowed_origins
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                        }));
                        form.post('/apps');
                    }}
                    className="border-rule bg-steel-raised divide-rule-soft divide-y rounded-md border"
                >
                    <Field
                        label="Name"
                        hint="An optional human-readable label."
                        error={form.errors.name}
                    >
                        <Input
                            autoFocus
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            placeholder="e.g. webhook.dev"
                            className="bg-transparent border-0 h-11 font-mono text-[14px] shadow-none focus-visible:ring-0 px-0"
                        />
                    </Field>

                    <Field
                        label="Allowed origins"
                        hint="Comma-separated. Use * to allow any origin."
                        error={form.errors.allowed_origins}
                    >
                        <Input
                            value={form.data.allowed_origins}
                            onChange={(e) =>
                                form.setData(
                                    'allowed_origins',
                                    e.target.value,
                                )
                            }
                            placeholder="https://hooks.example.com, https://crm.example.com"
                            className="bg-transparent border-0 h-11 font-mono text-[14px] shadow-none focus-visible:ring-0 px-0"
                        />
                    </Field>

                    <div className="flex items-center justify-end gap-3 px-5 py-4">
                        <Link
                            href="/apps"
                            className="text-ink-muted hover:text-ink font-mono text-[12px] tracking-[0.14em] uppercase transition-colors"
                        >
                            Cancel
                        </Link>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-signal text-signal-ink hover:bg-signal/90 h-10 rounded-md font-mono text-[12px] font-semibold tracking-wider uppercase shadow-none"
                        >
                            {form.processing ? 'Creating…' : 'Create app →'}
                        </Button>
                    </div>
                </form>

                <p className="text-ink-muted mt-6 font-mono text-[11.5px] leading-[1.7]">
                    Tip: rate limits and other tuning knobs can be set on the
                    app's detail page after creation.
                </p>
            </div>
        </AppLayout>
    );
}

function Field({
    label,
    hint,
    error,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="px-5 py-4">
            <div className="flex items-center justify-between gap-4">
                <Label className="console-eyebrow">{label}</Label>
                {hint && (
                    <span className="text-ink-muted font-mono text-[11px]">
                        {hint}
                    </span>
                )}
            </div>
            <div className="mt-1">{children}</div>
            {error && (
                <p className="text-danger mt-2 font-mono text-[12px]">
                    {error}
                </p>
            )}
        </div>
    );
}
