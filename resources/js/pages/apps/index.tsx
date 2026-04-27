import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

interface AppRow {
    app_id: string;
    name: string | null;
    key: string;
    allowed_origins: string[];
    rate_limit_enabled: boolean;
    created_at: string | null;
}

interface Props {
    apps: AppRow[];
}

export default function AppsIndex({ apps }: Props) {
    return (
        <AppLayout>
            <Head title="Apps" />

            <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                    <p className="console-eyebrow mb-2">
                        Vol. 01 — Apps
                    </p>
                    <h1 className="font-display text-[44px] leading-[1] tracking-tight italic lg:text-[56px]">
                        Apps
                    </h1>
                    <p className="text-ink-soft mt-3 text-[13px]">
                        Each app is a Pusher-protocol triplet — a publisher
                        signs subscriptions with the secret, the broadcaster
                        verifies the signature.
                    </p>
                </div>

                <Link href="/apps/create">
                    <Button className="bg-signal text-signal-ink hover:bg-signal/90 h-11 rounded-md font-mono text-[13px] font-semibold tracking-wider uppercase shadow-none">
                        New app →
                    </Button>
                </Link>
            </div>

            {apps.length === 0 ? <EmptyState /> : <AppsTable apps={apps} />}
        </AppLayout>
    );
}

function EmptyState() {
    return (
        <div className="border-rule bg-steel-raised flex flex-col items-center justify-center gap-4 rounded-md border px-8 py-20 text-center">
            <span className="bg-rule size-2 rounded-full" />
            <p className="font-mono text-[13.5px] font-medium">
                No apps yet.
            </p>
            <p className="text-ink-muted max-w-[36ch] font-mono text-[12px] leading-[1.6]">
                Create one to get a key/secret pair. Point a publisher at the
                broadcaster with the matching credentials and you're live.
            </p>
        </div>
    );
}

function AppsTable({ apps }: { apps: AppRow[] }) {
    return (
        <div className="border-rule bg-steel-raised overflow-hidden rounded-md border">
            <table className="w-full font-mono text-[12.5px]">
                <thead>
                    <tr className="border-rule border-b text-left">
                        <Th>Name</Th>
                        <Th>App ID</Th>
                        <Th>Key</Th>
                        <Th>Origins</Th>
                        <Th className="text-right">Created</Th>
                    </tr>
                </thead>
                <tbody>
                    {apps.map((app, i) => (
                        <tr
                            key={app.app_id}
                            className="border-rule-soft hover:bg-steel/40 group border-b transition-colors last:border-0"
                            style={{
                                animation: `console-rise 500ms cubic-bezier(0.2,0.7,0.2,1) ${
                                    i * 40
                                }ms both`,
                            }}
                        >
                            <td className="px-5 py-3.5">
                                <Link
                                    href={`/apps/${app.app_id}`}
                                    className="text-ink hover:text-signal block transition-colors"
                                >
                                    {app.name ?? (
                                        <span className="text-ink-muted italic">
                                            untitled
                                        </span>
                                    )}
                                </Link>
                            </td>
                            <td className="text-ink-soft tabular px-5 py-3.5">
                                {app.app_id}
                            </td>
                            <td className="text-ink-soft px-5 py-3.5">
                                <code>{truncate(app.key, 18)}</code>
                            </td>
                            <td className="text-ink-soft px-5 py-3.5">
                                {(app.allowed_origins ?? ['*'])
                                    .slice(0, 2)
                                    .join(', ')}
                                {(app.allowed_origins ?? []).length > 2 && (
                                    <span className="text-ink-muted">
                                        {' '}
                                        +
                                        {(app.allowed_origins ?? []).length - 2}
                                    </span>
                                )}
                            </td>
                            <td className="text-ink-muted tabular px-5 py-3.5 text-right">
                                {app.created_at
                                    ? new Date(
                                          app.created_at,
                                      ).toLocaleDateString()
                                    : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Th({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={`text-ink-muted px-5 py-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase ${className ?? ''}`}
        >
            {children}
        </th>
    );
}

function truncate(s: string, len: number): string {
    return s.length > len ? `${s.slice(0, len)}…` : s;
}
