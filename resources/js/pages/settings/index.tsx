import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    user: {
        name: string;
        email: string;
        plan: string;
        created_at: string | null;
    };
}

export default function Settings({ user }: Props) {
    const form = useForm({ name: user.name, email: user.email });
    const [deleting, setDeleting] = useState(false);

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch('/settings', { preserveScroll: true });
    };

    const destroy = () => {
        setDeleting(true);
        router.delete('/settings', { onFinish: () => setDeleting(false) });
    };

    return (
        <AppLayout>
            <Head title="Settings" />

            <div className="mx-auto max-w-[640px]">
                <div className="mb-10">
                    <p className="console-eyebrow mb-2">Account · Settings</p>
                    <h1 className="font-display text-[40px] leading-[1.05] tracking-tight italic">
                        Settings.
                    </h1>
                    <p className="text-ink-soft mt-3 text-[13px] leading-[1.6]">
                        Manage your account, export your data, or delete
                        everything.
                    </p>
                </div>

                {/* Profile — GDPR Art. 16 rectification */}
                <section className="border-rule bg-steel-raised mb-8 rounded-md border p-6">
                    <h2 className="console-eyebrow mb-5">Profile</h2>
                    <form onSubmit={save} className="space-y-5">
                        <div>
                            <Label htmlFor="name" className="console-eyebrow mb-2 block">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="bg-steel border-rule text-ink h-11 rounded-md font-mono text-[14px]"
                            />
                            {form.errors.name && (
                                <p className="text-danger mt-2 font-mono text-[12px]">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="email" className="console-eyebrow mb-2 block">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                className="bg-steel border-rule text-ink h-11 rounded-md font-mono text-[14px]"
                            />
                            {form.errors.email && (
                                <p className="text-danger mt-2 font-mono text-[12px]">
                                    {form.errors.email}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="bg-signal text-signal-ink hover:bg-signal/90 h-10 rounded-md px-5 font-mono text-[12px] font-semibold tracking-wider uppercase shadow-none"
                            >
                                {form.processing ? 'Saving…' : 'Save'}
                            </Button>
                            {form.recentlySuccessful && (
                                <span className="text-ink-muted font-mono text-[12px]">
                                    Saved.
                                </span>
                            )}
                        </div>
                    </form>
                </section>

                {/* Data export — GDPR Art. 20 portability */}
                <section className="border-rule bg-steel-raised mb-8 rounded-md border p-6">
                    <h2 className="console-eyebrow mb-3">Export your data</h2>
                    <p className="text-ink-soft mb-5 text-[13px] leading-[1.6]">
                        Download everything we hold about you — your account,
                        your Reverb apps, and their usage metrics — as a JSON
                        file.
                    </p>
                    <a
                        href="/settings/export"
                        className="border-rule text-ink hover:bg-steel inline-flex h-10 items-center rounded-md border px-5 font-mono text-[12px] font-semibold tracking-wider uppercase transition-colors"
                    >
                        Download export →
                    </a>
                </section>

                {/* Account deletion — GDPR Art. 17 erasure */}
                <section className="border-danger/40 bg-steel-raised rounded-md border p-6">
                    <h2 className="console-eyebrow text-danger mb-3">
                        Delete account
                    </h2>
                    <p className="text-ink-soft mb-5 text-[13px] leading-[1.6]">
                        Permanently erase your account, all your apps, and their
                        usage metrics. This cannot be undone.
                    </p>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-danger text-signal-ink hover:bg-danger/90 h-10 rounded-md px-5 font-mono text-[12px] font-semibold tracking-wider uppercase shadow-none">
                                Delete my account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-steel-raised border-rule text-ink">
                            <DialogHeader>
                                <DialogTitle className="font-display text-[22px] italic">
                                    Delete your account?
                                </DialogTitle>
                                <DialogDescription className="text-ink-soft text-[13px] leading-[1.6]">
                                    This permanently erases your profile, all
                                    your Reverb apps, and their usage metrics.
                                    Connected subscribers will be disconnected.
                                    This cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-4 gap-2">
                                <DialogClose asChild>
                                    <Button className="border-rule text-ink hover:bg-steel h-10 rounded-md border bg-transparent px-5 font-mono text-[12px] font-semibold tracking-wider uppercase shadow-none">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    onClick={destroy}
                                    disabled={deleting}
                                    className="bg-danger text-signal-ink hover:bg-danger/90 h-10 rounded-md px-5 font-mono text-[12px] font-semibold tracking-wider uppercase shadow-none"
                                >
                                    {deleting ? 'Deleting…' : 'Delete account'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </section>
            </div>
        </AppLayout>
    );
}
