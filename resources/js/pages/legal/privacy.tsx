import LegalLayout from '@/layouts/legal-layout';

export default function Privacy() {
    return (
        <LegalLayout title="Privacy Policy" updated="22 June 2026">
            <p>
                This Privacy Policy explains how reverb·manager collects, uses,
                and protects your personal data when you use our hosted Laravel
                Reverb broadcaster management platform (the “Service”). We
                process personal data in accordance with the EU General Data
                Protection Regulation (GDPR) and Danish data protection law, and
                we are supervised by the Danish Data Protection Agency
                (Datatilsynet).
            </p>

            <h2>1. Data controller</h2>
            <p>
                The data controller responsible for your personal data is Henrik
                Nordquist, CVR 37906794, registered at Hedeparken 173, 2. th,
                2750 Ballerup, Denmark (“we”, “us”, “reverb·manager”). For any
                privacy question or to exercise your rights, contact{' '}
                <a href="mailto:henrik@henriknordquist.dk">
                    henrik@henriknordquist.dk
                </a>
                .
            </p>

            <h2>2. What data we collect</h2>
            <ul>
                <li>
                    <strong>Account data:</strong> your name and email address.
                    We authenticate you with passwordless magic links, so we do
                    not store a password.
                </li>
                <li>
                    <strong>Service data:</strong> the Reverb applications you
                    create and their configuration (app credentials, allowed
                    origins, connection limits), plus aggregate usage counts
                    (connections, messages, and publishes) bucketed by the hour.
                </li>
                <li>
                    <strong>Technical data:</strong> your IP address and session
                    information needed to operate and secure the Service, held
                    transiently in our session store.
                </li>
                <li>
                    <strong>Communications:</strong> any messages you send us
                    for support.
                </li>
            </ul>
            <p>
                Providing account data is necessary to enter into and perform
                our contract with you; without it we cannot provide the Service.
            </p>

            <h2>3. Why we use your data and our legal bases</h2>
            <ul>
                <li>
                    <strong>To provide the Service</strong> — managing your
                    Reverb apps and showing their usage — performance of our
                    contract with you (GDPR Art. 6(1)(b)).
                </li>
                <li>
                    <strong>To send service-related emails</strong> (one-time
                    login links) — performance of contract.
                </li>
                <li>
                    <strong>To secure, maintain, and improve the Service</strong>{' '}
                    — our legitimate interests in operating a safe, reliable
                    platform (Art. 6(1)(f)).
                </li>
            </ul>

            <h2>4. Cookies</h2>
            <p>
                We use a strictly necessary, first-party session cookie to keep
                you signed in. Under the ePrivacy “strictly necessary”
                exemption, this cookie does not require a consent banner. If — and
                only if — you tick “Keep me signed in” when requesting a login
                link, we also set a persistent authentication cookie; this is
                optional and based on your consent, which you give by ticking
                that box. We do not use advertising, analytics, or third-party
                tracking cookies.
            </p>

            <h2>5. Where your data is hosted</h2>
            <p>
                reverb·manager’s application, database, and session store are
                hosted in the European Union on Hetzner infrastructure in
                Germany, under a signed data processing agreement. We are an
                EU-based company operating under EU law, and your data stays in
                the EU/EEA.
            </p>

            <h2>6. Sub-processors and recipients</h2>
            <p>
                We share personal data with the following service providers
                strictly as needed to operate the Service:
            </p>
            <ul>
                <li>
                    <strong>Hetzner</strong> (Germany, EU) — hosting of the
                    reverb·manager application, database, and session store.
                </li>
                <li>
                    <strong>Brevo</strong> (France, EU) — delivery of
                    transactional emails (one-time login links).
                </li>
            </ul>
            <p>
                Both sub-processors are located in the EU, so we make no
                transfers of personal data outside the EU/EEA. We do not sell
                your personal data, and we never share it for advertising.
            </p>

            <h2>7. How long we keep your data</h2>
            <ul>
                <li>
                    <strong>Account and service data</strong> — for as long as
                    your account is active. When you delete your account, we
                    erase it, your Reverb apps, and their usage metrics
                    immediately.
                </li>
                <li>
                    <strong>Usage metrics</strong> — retained for up to 90 days,
                    then automatically pruned.
                </li>
                <li>
                    <strong>Session data</strong> — held in our session store
                    and expires automatically; it is not retained long-term.
                </li>
                <li>
                    <strong>Magic login links</strong> — valid for 15 minutes
                    and single-use.
                </li>
            </ul>

            <h2>8. Your rights</h2>
            <p>Under the GDPR you have the right to:</p>
            <ul>
                <li>access the personal data we hold about you;</li>
                <li>have inaccurate data corrected;</li>
                <li>have your data erased;</li>
                <li>restrict or object to certain processing;</li>
                <li>receive your data in a portable format;</li>
                <li>withdraw consent where processing is based on consent.</li>
            </ul>
            <p>
                You can export your data and delete your account at any time
                from your account settings. To exercise any other right, email{' '}
                <a href="mailto:henrik@henriknordquist.dk">
                    henrik@henriknordquist.dk
                </a>
                . You also have the right to lodge a complaint with the Danish
                Data Protection Agency (Datatilsynet),{' '}
                <a
                    href="https://www.datatilsynet.dk"
                    target="_blank"
                    rel="noopener"
                >
                    datatilsynet.dk
                </a>
                .
            </p>

            <h2>9. Automated decision-making</h2>
            <p>
                We do not use your personal data for automated decision-making
                or profiling that produces legal or similarly significant
                effects.
            </p>

            <h2>10. Security</h2>
            <p>
                We use appropriate technical and organisational measures to
                protect your data, including encryption in transit (TLS),
                encrypted storage of the application key, hidden app secrets, and
                access controls. No method of transmission or storage is
                completely secure, but we work to protect your data and to notify
                you and the supervisory authority of any breach where required by
                law.
            </p>

            <h2>11. Data processed on your behalf</h2>
            <p>
                When your end users connect to the Reverb apps you run through
                reverb·manager, their realtime messages pass through our
                broadcaster in transit. We do <strong>not</strong> store the
                content of those messages — only aggregate counts. To the extent
                we process personal data contained in that traffic, we act solely
                as your <strong>data processor</strong>, on your instructions and
                never for our own purposes; a data processing agreement (GDPR
                Art. 28) covering this is available — see our{' '}
                <a href="/terms">Terms of Service</a>.
            </p>

            <h2>12. Children</h2>
            <p>
                The Service is not intended for individuals under 18, and we do
                not knowingly collect data from children.
            </p>

            <h2>13. Changes to this policy</h2>
            <p>
                We may update this policy from time to time. We will post the
                updated version here and revise the “Last updated” date above.
                Material changes will be communicated by email where
                appropriate.
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
