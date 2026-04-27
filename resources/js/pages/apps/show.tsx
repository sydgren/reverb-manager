import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AppPayload {
    app_id: string;
    name: string | null;
    key: string;
    secret: string;
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

interface BroadcasterInfo {
    host: string;
    port: number;
    scheme: string;
}

interface SparklinePoint {
    hour: string;
    count: number;
}

interface Stats {
    connections: number | null;
    channels: number | null;
    messages_24h: number;
    messages_30d: number;
    sparkline: SparklinePoint[];
}

interface Props {
    app: AppPayload;
    broadcaster: BroadcasterInfo;
    stats: Stats;
}

export default function ShowApp({ app, broadcaster, stats }: Props) {
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

                <StatsRow stats={stats} />

                <div className="mb-10 grid gap-6 lg:grid-cols-2">
                    <section className="border-rule bg-steel-raised rounded-md border">
                        <div className="border-rule-soft border-b px-5 py-3">
                            <span className="console-eyebrow">Credentials</span>
                        </div>
                        <Cred label="Key" value={app.key} />
                        <Cred label="Secret" value={app.secret} />
                    </section>

                    <DotenvSnippet app={app} broadcaster={broadcaster} />
                </div>

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
                            className="h-10 border-0 bg-transparent px-0 font-mono shadow-none focus-visible:ring-0"
                        />
                    </Field>

                    <Field
                        label="Allowed origins"
                        hint="Comma-separated. * allows any."
                    >
                        <Input
                            value={form.data.allowed_origins}
                            onChange={(e) =>
                                form.setData('allowed_origins', e.target.value)
                            }
                            className="h-10 border-0 bg-transparent px-0 font-mono shadow-none focus-visible:ring-0"
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
                                className="h-10 border-0 bg-transparent px-0 font-mono shadow-none focus-visible:ring-0"
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
                                className="h-10 border-0 bg-transparent px-0 font-mono shadow-none focus-visible:ring-0"
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
                                className="h-10 border-0 bg-transparent px-0 font-mono shadow-none focus-visible:ring-0"
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
                                className="h-10 border-0 bg-transparent px-0 font-mono shadow-none focus-visible:ring-0"
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
        </AppLayout>
    );
}

function Cred({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    };

    return (
        <div className="border-rule-soft flex items-center justify-between gap-4 border-b px-5 py-4 last:border-0">
            <div className="min-w-0 flex-1">
                <Label className="console-eyebrow mb-1.5 block">{label}</Label>
                <code
                    onClick={copy}
                    className="text-ink block cursor-pointer truncate font-mono text-[13px]"
                >
                    {value}
                </code>
            </div>
            <button
                onClick={copy}
                className={`shrink-0 font-mono text-[11.5px] tracking-[0.14em] uppercase transition-colors ${
                    copied ? 'text-live' : 'text-ink-muted hover:text-ink'
                }`}
            >
                {copied ? 'Copied' : 'Copy'}
            </button>
        </div>
    );
}

function StatsRow({ stats }: { stats: Stats }) {
    return (
        <section className="border-rule bg-steel-raised mb-10 grid grid-cols-2 divide-x divide-y rounded-md border lg:grid-cols-4 lg:divide-y-0">
            <Stat
                label="Connections"
                value={
                    stats.connections === null
                        ? '—'
                        : formatNumber(stats.connections)
                }
                hint={
                    stats.connections === null ? 'broadcaster offline' : 'live'
                }
                live={stats.connections !== null}
            />
            <Stat
                label="Channels"
                value={
                    stats.channels === null
                        ? '—'
                        : formatNumber(stats.channels)
                }
                hint={
                    stats.channels === null ? 'broadcaster offline' : 'live'
                }
            />
            <Stat
                label="Messages · 24h"
                value={formatNumber(stats.messages_24h)}
                sparkline={stats.sparkline}
            />
            <Stat
                label="Messages · 30d"
                value={formatNumber(stats.messages_30d)}
            />
        </section>
    );
}

function Stat({
    label,
    value,
    hint,
    live,
    sparkline,
}: {
    label: string;
    value: string;
    hint?: string;
    live?: boolean;
    sparkline?: SparklinePoint[];
}) {
    return (
        <div className="flex flex-col gap-3 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
                <span className="console-eyebrow">{label}</span>
                {live && <span className="live-dot" />}
            </div>
            <div className="text-ink font-display text-[36px] leading-[1] tracking-tight italic">
                {value}
            </div>
            {sparkline && sparkline.length > 0 ? (
                <Sparkline points={sparkline} />
            ) : hint ? (
                <span className="text-ink-muted font-mono text-[10.5px] tracking-[0.14em] uppercase">
                    {hint}
                </span>
            ) : (
                <span className="h-[16px]" aria-hidden />
            )}
        </div>
    );
}

function Sparkline({ points }: { points: SparklinePoint[] }) {
    const max = Math.max(...points.map((p) => p.count), 1);
    const width = 120;
    const height = 16;
    const stepX = width / Math.max(points.length - 1, 1);

    const path = points
        .map((p, i) => {
            const x = i * stepX;
            const y = height - (p.count / max) * height;
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="text-signal h-[16px] w-full"
            preserveAspectRatio="none"
            aria-hidden
        >
            <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

function formatNumber(n: number): string {
    if (n < 1000) return String(n);
    if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`;
    return `${(n / 1_000_000).toFixed(1)}M`;
}

function DotenvSnippet({
    app,
    broadcaster,
}: {
    app: AppPayload;
    broadcaster: BroadcasterInfo;
}) {
    const [copied, setCopied] = useState(false);

    const env = `BROADCAST_CONNECTION=reverb

REVERB_APP_ID=${app.app_id}
REVERB_APP_KEY=${app.key}
REVERB_APP_SECRET=${app.secret}

REVERB_HOST=${broadcaster.host}
REVERB_PORT=${broadcaster.port}
REVERB_SCHEME=${broadcaster.scheme}

VITE_REVERB_APP_KEY="\${REVERB_APP_KEY}"
VITE_REVERB_HOST="\${REVERB_HOST}"
VITE_REVERB_PORT="\${REVERB_PORT}"
VITE_REVERB_SCHEME="\${REVERB_SCHEME}"`;

    const copy = async () => {
        await navigator.clipboard.writeText(env);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    };

    return (
        <section className="border-rule bg-steel-raised flex flex-col rounded-md border">
            <div className="border-rule-soft flex items-center justify-between gap-3 border-b px-5 py-3">
                <span className="console-eyebrow">Laravel · .env</span>
                <button
                    onClick={copy}
                    className={`font-mono text-[11.5px] tracking-[0.14em] uppercase transition-colors ${
                        copied ? 'text-live' : 'text-ink-muted hover:text-ink'
                    }`}
                >
                    {copied ? 'Copied' : 'Copy all'}
                </button>
            </div>
            <pre className="text-ink-soft scroll-thin flex-1 overflow-x-auto px-5 py-4 font-mono text-[12px] leading-[1.7] whitespace-pre">
                {env}
            </pre>
        </section>
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
