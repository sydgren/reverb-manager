import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AppPayload {
    app_id: string;
    name: string | null;
    key: string;
    allowed_origins: string[];
    ping_interval: number;
    activity_timeout: number;
    max_connections: number | null;
    max_message_size: number;
    accept_client_events_from: 'all' | 'members' | 'none';
    rate_limit_enabled: boolean;
    rate_limit_max_attempts: number;
    rate_limit_decay_seconds: number;
    rate_limit_terminate_on_limit: boolean;
    created_at: string | null;
}

interface Props {
    app: AppPayload;
    reveal_secret: string | null;
}

export default function ShowApp({ app, reveal_secret }: Props) {
    const [secretOpen, setSecretOpen] = useState(Boolean(reveal_secret));

    useEffect(() => {
        if (reveal_secret) {
            setSecretOpen(true);
        }
    }, [reveal_secret]);

    const form = useForm({
        name: app.name ?? '',
        allowed_origins: (app.allowed_origins ?? ['*']).join(', '),
        ping_interval: app.ping_interval,
        activity_timeout: app.activity_timeout,
        max_connections: app.max_connections ?? '',
        max_message_size: app.max_message_size,
        accept_client_events_from: app.accept_client_events_from,
        rate_limit_enabled: app.rate_limit_enabled,
        rate_limit_max_attempts: app.rate_limit_max_attempts,
        rate_limit_decay_seconds: app.rate_limit_decay_seconds,
        rate_limit_terminate_on_limit: app.rate_limit_terminate_on_limit,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            allowed_origins: data.allowed_origins
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            max_connections:
                data.max_connections === ''
                    ? null
                    : Number(data.max_connections),
        }));
        form.patch(`/apps/${app.app_id}`, { preserveScroll: true });
    };

    const rotateSecret = () => {
        if (
            !window.confirm(
                'Rotate the secret? Any publishers using the current secret will stop working until they pick up the new one.',
            )
        ) {
            return;
        }
        router.post(`/apps/${app.app_id}/rotate-secret`);
    };

    const destroy = () => {
        if (
            !window.confirm(
                'Delete this app? Connected subscribers will be disconnected.',
            )
        ) {
            return;
        }
        router.delete(`/apps/${app.app_id}`);
    };

    return (
        <AppLayout>
            <Head title={app.name ?? 'App'} />

            <div className="mx-auto max-w-[840px]">
                {/* eyebrow */}
                <div className="console-eyebrow mb-2 flex items-center gap-3">
                    <Link
                        href="/apps"
                        className="hover:text-ink transition-colors"
                    >
                        ← Apps
                    </Link>
                    <span className="bg-rule h-px flex-1" />
                    <span className="tabular">App ID · {app.app_id}</span>
                </div>

                <div className="mb-10">
                    <h1 className="font-display text-[44px] leading-[1] tracking-tight italic lg:text-[56px]">
                        {app.name ?? (
                            <span className="text-ink-muted">untitled</span>
                        )}
                    </h1>
                </div>

                {/* Credentials block — sticky-feeling, important */}
                <section className="border-rule bg-steel-raised mb-10 rounded-md border">
                    <div className="border-rule-soft border-b px-5 py-3">
                        <span className="console-eyebrow">Credentials</span>
                    </div>
                    <Cred label="Key" value={app.key} mono />
                    <Cred
                        label="Secret"
                        value={'•••••••••••••••••••••• (hidden)'}
                        action={
                            <button
                                onClick={rotateSecret}
                                className="text-ink-muted hover:text-warn font-mono text-[11.5px] tracking-[0.14em] uppercase transition-colors"
                            >
                                Rotate
                            </button>
                        }
                    />
                </section>

                {/* Settings form */}
                <form
                    onSubmit={submit}
                    className="border-rule bg-steel-raised divide-rule-soft divide-y rounded-md border"
                >
                    <div className="px-5 py-3">
                        <span className="console-eyebrow">Settings</span>
                    </div>

                    <Field label="Name">
                        <Input
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            className="border-0 bg-transparent h-10 px-0 font-mono shadow-none focus-visible:ring-0"
                        />
                    </Field>

                    <Field
                        label="Allowed origins"
                        hint="Comma-separated. * allows any."
                    >
                        <Input
                            value={form.data.allowed_origins}
                            onChange={(e) =>
                                form.setData(
                                    'allowed_origins',
                                    e.target.value,
                                )
                            }
                            className="border-0 bg-transparent h-10 px-0 font-mono shadow-none focus-visible:ring-0"
                        />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        <Field label="Ping interval (s)">
                            <Input
                                type="number"
                                value={form.data.ping_interval}
                                onChange={(e) =>
                                    form.setData(
                                        'ping_interval',
                                        Number(e.target.value),
                                    )
                                }
                                className="border-0 bg-transparent h-10 px-0 font-mono shadow-none focus-visible:ring-0"
                            />
                        </Field>
                        <Field label="Activity timeout (s)">
                            <Input
                                type="number"
                                value={form.data.activity_timeout}
                                onChange={(e) =>
                                    form.setData(
                                        'activity_timeout',
                                        Number(e.target.value),
                                    )
                                }
                                className="border-0 bg-transparent h-10 px-0 font-mono shadow-none focus-visible:ring-0"
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        <Field
                            label="Max connections"
                            hint="Blank = unlimited"
                        >
                            <Input
                                type="number"
                                value={form.data.max_connections}
                                onChange={(e) =>
                                    form.setData(
                                        'max_connections',
                                        e.target.value as never,
                                    )
                                }
                                placeholder="∞"
                                className="border-0 bg-transparent h-10 px-0 font-mono shadow-none focus-visible:ring-0"
                            />
                        </Field>
                        <Field label="Max message size (bytes)">
                            <Input
                                type="number"
                                value={form.data.max_message_size}
                                onChange={(e) =>
                                    form.setData(
                                        'max_message_size',
                                        Number(e.target.value),
                                    )
                                }
                                className="border-0 bg-transparent h-10 px-0 font-mono shadow-none focus-visible:ring-0"
                            />
                        </Field>
                    </div>

                    <Field label="Rate limit">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.data.rate_limit_enabled}
                                onChange={(e) =>
                                    form.setData(
                                        'rate_limit_enabled',
                                        e.target.checked,
                                    )
                                }
                                className="border-rule bg-steel size-4 rounded-sm"
                            />
                            <span className="font-mono text-[12.5px]">
                                Enabled
                            </span>
                        </label>
                    </Field>

                    <div className="flex items-center justify-between gap-3 px-5 py-4">
                        <button
                            type="button"
                            onClick={destroy}
                            className="text-danger/80 hover:text-danger font-mono text-[11.5px] tracking-[0.14em] uppercase transition-colors"
                        >
                            Delete app
                        </button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-signal text-signal-ink hover:bg-signal/90 h-10 rounded-md font-mono text-[12px] font-semibold tracking-wider uppercase shadow-none"
                        >
                            {form.processing ? 'Saving…' : 'Save changes'}
                        </Button>
                    </div>
                </form>

                <p className="text-ink-muted mt-6 font-mono text-[11.5px] leading-[1.7]">
                    Any save triggers a graceful{' '}
                    <code className="text-ink">reverb:restart</code> — the
                    daemon drains existing connections and picks up the new
                    config.
                </p>
            </div>

            {/* Show-secret-once dialog */}
            <Dialog open={secretOpen} onOpenChange={setSecretOpen}>
                <DialogContent className="bg-steel-raised border-rule sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="font-display text-[24px] italic">
                            Copy your secret.
                        </DialogTitle>
                        <DialogDescription className="text-ink-soft mt-2 font-mono text-[13px] leading-[1.6]">
                            We won't show it again. Store it somewhere safe —
                            publishers need it to sign subscription requests.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-2">
                        <span className="console-eyebrow mb-2 block">
                            Secret
                        </span>
                        <code className="border-rule bg-steel text-ink block w-full break-all rounded-md border px-3 py-2.5 font-mono text-[13px]">
                            {reveal_secret}
                        </code>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button
                            onClick={() => {
                                if (reveal_secret) {
                                    navigator.clipboard.writeText(reveal_secret);
                                }
                                setSecretOpen(false);
                            }}
                            className="bg-signal text-signal-ink hover:bg-signal/90 font-mono"
                        >
                            Copy & close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function Cred({
    label,
    value,
    mono = true,
    action,
}: {
    label: string;
    value: string;
    mono?: boolean;
    action?: React.ReactNode;
}) {
    const [copied, setCopied] = useState(false);
    const copyable = !value.includes('•');

    const copy = async () => {
        if (!copyable) return;
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    };

    return (
        <div className="border-rule-soft flex items-center justify-between gap-4 border-b px-5 py-4 last:border-0">
            <div className="min-w-0 flex-1">
                <Label className="console-eyebrow mb-1.5 block">{label}</Label>
                <div
                    onClick={copy}
                    className={`text-ink truncate ${mono ? 'font-mono' : ''} text-[13px] ${
                        copyable ? 'cursor-pointer' : ''
                    }`}
                >
                    {value}
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
                {action}
                {copyable && (
                    <button
                        onClick={copy}
                        className={`font-mono text-[11.5px] tracking-[0.14em] uppercase transition-colors ${
                            copied
                                ? 'text-live'
                                : 'text-ink-muted hover:text-ink'
                        }`}
                    >
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                )}
            </div>
        </div>
    );
}

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
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
        </div>
    );
}
