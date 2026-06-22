import LegalLayout from '@/layouts/legal-layout';

export default function Terms() {
    return (
        <LegalLayout title="Terms of Service" updated="22 June 2026">
            <p>
                These Terms of Service (“Terms”) govern your access to and use
                of reverb·manager (the “Service”), operated by Henrik Nordquist,
                CVR 37906794, Denmark. By creating an account or using the
                Service, you agree to these Terms. If you are using the Service
                on behalf of an organisation, you confirm that you are
                authorised to bind that organisation.
            </p>

            <h2>1. The Service</h2>
            <p>
                reverb·manager lets you create and manage Laravel Reverb
                broadcaster applications and view their usage. You remain
                responsible for the applications and end-user traffic you run
                through the Service.
            </p>

            <h2>2. Early access</h2>
            <p>
                The Service is currently offered on a free plan. Features and
                plan limits may change, and the Service is provided “as is” (see
                section 8). We will give reasonable notice before introducing
                paid plans or enforcing new limits.
            </p>

            <h2>3. Accounts</h2>
            <p>
                You must provide accurate information and keep your account
                secure. You are responsible for all activity that occurs under
                your account. Notify us promptly of any unauthorised use.
            </p>

            <h2>4. Acceptable use</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
                <li>break any applicable law or regulation;</li>
                <li>
                    transmit malicious code, or attack, disrupt, or gain
                    unauthorised access to any system;
                </li>
                <li>infringe the intellectual property or privacy of others;</li>
                <li>
                    abuse, overload, or attempt to circumvent the limits or
                    security of the Service.
                </li>
            </ul>

            <h2>5. Your responsibilities</h2>
            <ul>
                <li>
                    You are responsible for the applications you connect and the
                    content and messages you broadcast through them.
                </li>
                <li>
                    You are responsible for having a lawful basis to process any
                    personal data of your own end users that passes through your
                    Reverb apps.
                </li>
            </ul>

            <h2>6. Third-party services</h2>
            <p>
                The Service relies on third parties such as our hosting provider
                (Hetzner) and email delivery (Brevo). Your use of the Service is
                subject to their continued availability, and we are not
                responsible for their own services.
            </p>

            <h2>7. Plans and cancellation</h2>
            <p>
                The Service is currently free. When paid plans become available,
                we will publish pricing and give notice before any charges
                apply, and there will be no lock-in: you will be able to cancel
                at any time from your account settings. You can delete your
                account at any time. Arrangements beyond the standard plans can
                be agreed by contacting us at{' '}
                <a href="mailto:henrik@henriknordquist.dk">
                    henrik@henriknordquist.dk
                </a>
                .
            </p>

            <h2>8. Disclaimer of warranties</h2>
            <p>
                To the fullest extent permitted by law, and except for mandatory
                rights that apply to consumers, the Service is provided “as is”
                and “as available” without warranties of any kind, whether
                express or implied. We do not warrant that the Service will be
                uninterrupted or error-free.
            </p>

            <h2>9. Limitation of liability</h2>
            <p>
                To the maximum extent permitted by applicable law,
                reverb·manager shall not be liable for any indirect, incidental,
                or consequential damages, or for loss of data, profits, or
                revenue arising from your use of the Service. Our total
                liability for any claim shall not exceed the greater of the
                amount you paid us in the 12 months before the claim or €100.
                Nothing in these Terms excludes or limits liability that cannot
                be limited under applicable law, including for intent or gross
                negligence, personal injury, or under mandatory
                consumer-protection rules.
            </p>

            <h2>10. Termination</h2>
            <p>
                You may stop using the Service and delete your account at any
                time. We may suspend or terminate your access if you breach these
                Terms or use the Service in a way that risks harm to others.
            </p>

            <h2>11. Data protection and our dual role</h2>
            <p>
                For your account and login data, we are the{' '}
                <strong>data controller</strong>, and our handling of that data
                is described in our <a href="/privacy">Privacy Policy</a>.
            </p>
            <p>
                When your end users connect to the Reverb apps you run through
                the Service, their realtime messages pass through our broadcaster
                in transit. We do <strong>not</strong> store the content of those
                messages — only aggregate usage counts. To the extent we process
                personal data contained in that traffic, we act solely as your{' '}
                <strong>data processor</strong>, on your documented instructions
                and never for our own purposes. A data processing agreement (GDPR
                Art. 28) covering this processing is available on request at{' '}
                <a href="mailto:henrik@henriknordquist.dk">
                    henrik@henriknordquist.dk
                </a>
                . Our sub-processors are listed in the Privacy Policy; we will
                inform you of any intended changes and give you the opportunity
                to object.
            </p>

            <h2>12. Changes to these Terms</h2>
            <p>
                We may update these Terms from time to time. We will post the
                updated version here and revise the “Last updated” date above.
                Continued use of the Service after changes take effect
                constitutes acceptance.
            </p>

            <h2>13. Governing law and venue</h2>
            <p>
                These Terms are governed by the laws of Denmark, without regard
                to conflict-of-law rules. Disputes shall be subject to the
                jurisdiction of the Danish courts, unless mandatory
                consumer-protection law grants you the right to bring
                proceedings in your country of residence.
            </p>

            <h2>14. Contact</h2>
            <p>
                Henrik Nordquist
                <br />
                Hedeparken 173, 2. th, 2750 Ballerup, Denmark
                <br />
                <a href="mailto:henrik@henriknordquist.dk">
                    henrik@henriknordquist.dk
                </a>
            </p>
        </LegalLayout>
    );
}
