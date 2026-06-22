import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
    const form = useForm({ email: '', remember: false });

    return (
        <AuthLayout>
            <Head title="Sign in" />

            <div className="mb-6">
                <h1 className="font-display text-[28px] leading-tight italic">
                    Sign in.
                </h1>
                <p className="text-ink-soft mt-2 text-[13px] leading-[1.6]">
                    Enter your email — we'll send you a one-time link.
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post('/login');
                }}
                className="space-y-5"
            >
                <div>
                    <Label
                        htmlFor="email"
                        className="console-eyebrow mb-2 block"
                    >
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        autoFocus
                        required
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        className="bg-steel border-rule text-ink h-11 rounded-md font-mono text-[14px]"
                        placeholder="you@example.com"
                    />
                    {form.errors.email && (
                        <p className="text-danger mt-2 font-mono text-[12px]">
                            {form.errors.email}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2.5">
                    <Checkbox
                        id="remember"
                        checked={form.data.remember}
                        onCheckedChange={(checked) =>
                            form.setData('remember', checked === true)
                        }
                        className="border-rule data-[state=checked]:bg-signal data-[state=checked]:text-signal-ink data-[state=checked]:border-signal"
                    />
                    <Label
                        htmlFor="remember"
                        className="text-ink-soft text-[12px] leading-snug"
                    >
                        Keep me signed in on this device{' '}
                        <span className="text-ink-muted">(uses a cookie)</span>
                    </Label>
                </div>

                <Button
                    type="submit"
                    disabled={form.processing}
                    className="bg-signal text-signal-ink hover:bg-signal/90 h-11 w-full rounded-md font-mono text-[13px] font-semibold tracking-wider uppercase shadow-none"
                >
                    {form.processing ? 'Sending…' : 'Send magic link →'}
                </Button>
            </form>

            <div className="border-rule-soft text-ink-muted mt-8 border-t pt-5 font-mono text-[11px] leading-[1.7]">
                The link is good for 15 minutes and can only be used once.
            </div>
        </AuthLayout>
    );
}
