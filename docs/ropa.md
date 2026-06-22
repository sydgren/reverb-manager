# Records of Processing Activities (GDPR Art. 30)

**Service:** reverb·manager — hosted management platform for Laravel Reverb broadcaster applications
**Document owner:** Henrik Nordquist
**Version:** 1.0 · **Last updated:** 22 June 2026 · **Review cadence:** at least annually, and on any material change to processing

> Internal compliance record maintained under Article 30 of the GDPR. This is an
> engineering-maintained working document, not legal advice; have it reviewed by a
> qualified data-protection adviser before relying on it externally.

---

## 1. Controller / processor identity

| Field | Value |
| --- | --- |
| Legal entity | Henrik Nordquist (sole proprietor) |
| CVR | 37906794 |
| Registered address | Hedeparken 173, 2. th, 2750 Ballerup, Denmark |
| Contact for data protection | henrik@henriknordquist.dk |
| Data Protection Officer | Not appointed — not required (no large-scale or special-category processing under Art. 37) |
| EU representative (Art. 27) | Not required — controller is established in the EU (Denmark) |
| Supervisory authority | Datatilsynet (Danish Data Protection Agency), datatilsynet.dk |

### Dual role

- **Controller** for the account, authentication and operational data of its own customers (Part A, Art. 30(1)).
- **Processor** for any personal data contained in the realtime messages that customers' end users send through the Reverb apps they run on the platform (Part B, Art. 30(2)). Message *content* is never stored — only aggregate counts.

---

## 2. Part A — Controller activities (Art. 30(1))

### A1. Account management & authentication

| Aspect | Detail |
| --- | --- |
| Purpose | Create and operate user accounts; passwordless (magic-link) authentication |
| Legal basis | Performance of a contract — Art. 6(1)(b) |
| Data subjects | Registered users (customers) |
| Personal data | Name, email address; `remember_token` (only if the user opts into "keep me signed in"); plan tier; account timestamps. Magic-link sign-in uses a short-lived signed URL embedding the user ID — no password is stored. |
| Recipients / sub-processors | Hetzner (hosting); Brevo (delivery of login-link emails) — see §4 |
| International transfers | None — all recipients are in the EU/EEA |
| Retention | Held while the account is active; erased immediately on account deletion (self-service). |
| Security | See §5 |

### A2. Operating the Reverb-app management service

| Aspect | Detail |
| --- | --- |
| Purpose | Let users create, configure and monitor their Reverb broadcaster applications |
| Legal basis | Performance of a contract — Art. 6(1)(b) |
| Data subjects | Registered users |
| Personal data | App configuration tied to the user (app ID, key, secret, allowed origins, connection limits) and aggregate usage counts (connections, messages, publishes) bucketed by the hour. The usage counts are not personal data in themselves but are linked to the owning account. |
| Recipients / sub-processors | Hetzner (hosting of application, database, session store) |
| International transfers | None |
| Retention | App configuration: until the app or account is deleted. Usage metrics: pruned automatically after 90 days. |
| Security | See §5 |

### A3. Security, abuse prevention & operational logging

| Aspect | Detail |
| --- | --- |
| Purpose | Keep the service secure and reliable; investigate errors and abuse |
| Legal basis | Legitimate interests — Art. 6(1)(f) (operating a safe, reliable platform) |
| Data subjects | Registered users; visitors who attempt to authenticate |
| Personal data | IP address and user-agent (in the session record); transient diagnostic data in application/error logs and queued-job payloads (which may include a login email address) |
| Recipients / sub-processors | Hetzner (hosting) |
| International transfers | None |
| Retention | Sessions live in **Redis** with a short TTL and expire automatically (not persisted to the database). Failed-job records (which can contain a login email) are pruned weekly (`queue:prune-failed`, ~7 days). Magic-link signed URLs expire after 15 minutes and are single-use. |
| Security | See §5 |

---

## 3. Part B — Processor activity (Art. 30(2))

| Aspect | Detail |
| --- | --- |
| Acting on behalf of | Each customer (the controller) who runs Reverb apps on the platform |
| Categories of processing | Relaying realtime WebSocket messages between the customer's end users and counting them in aggregate. Message **content is not stored** — only per-app, per-hour counts of connections/messages/publishes. |
| Personal data (potentially) | Any personal data the customer's end users include in their message payloads — transient, in transit only |
| Sub-processors | Hetzner (the infrastructure the broadcaster runs on). No other sub-processor receives this traffic. |
| International transfers | None — processing occurs on EU infrastructure |
| Instructions | Processed solely on the customer's documented instructions; a data processing agreement (Art. 28) is available on request (referenced in the Terms of Service) |
| Security | See §5 |

---

## 4. Sub-processor register

| Sub-processor | Location | Purpose | Transfer outside EU/EEA |
| --- | --- | --- | --- |
| Hetzner Online GmbH | Germany (EU) | Hosting of the application, database, and Redis session store | No |
| Brevo (Sendinblue) | France (EU) | Delivery of transactional email (magic-link login) | No |

All current sub-processors are established in the EU, so **no personal data is transferred outside the EU/EEA** and no Chapter V transfer mechanism (adequacy decision / SCCs) is currently required. Customers are informed of any intended change to this list and may object (Terms of Service §11).

> Future note: a payment processor (e.g. Stripe) may be added when paid plans launch. If so, add it here with its location, purpose and — if outside the EU/EEA — the transfer safeguard relied upon, and add a corresponding billing entry to Part A.

---

## 5. Technical & organisational security measures (Art. 32)

- **Encryption in transit:** all traffic served over TLS/HTTPS.
- **Credential handling:** passwordless authentication (no passwords stored); application encryption key kept out of source control; app secrets hidden from API responses.
- **Access control:** per-user data scoping and authorization policies; users can only see and mutate their own apps.
- **Data minimisation:** sessions held in Redis with a short TTL; usage stored only as aggregate hourly counts (no message content); failed-job and metric pruning on a schedule; immediate erasure on account deletion.
- **Hosting & resilience:** EU hosting on Hetzner under a data processing agreement; backups and restore handled at the infrastructure level.
- **Confidentiality, integrity, availability:** ongoing monitoring of the broadcaster; graceful restart on configuration changes.

---

## 6. Personal data breach procedure (Art. 33–34)

- On becoming aware of a personal data breach, assess the risk to data subjects.
- As **controller**: notify Datatilsynet without undue delay and, where feasible, within **72 hours**, unless the breach is unlikely to result in a risk to rights and freedoms; where the breach is likely to result in a **high risk**, also inform the affected data subjects without undue delay.
- As **processor**: notify the affected customer(s) (controllers) without undue delay after becoming aware.
- Record every breach (facts, effects, remedial action) regardless of whether it is notifiable.

---

## 7. Data subject rights (how they are fulfilled)

| Right | Mechanism |
| --- | --- |
| Access (Art. 15) / Portability (Art. 20) | Self-service JSON export at `/settings` |
| Rectification (Art. 16) | Edit name/email at `/settings` |
| Erasure (Art. 17) | Self-service account deletion at `/settings` (cascades to apps and usage metrics) |
| Restriction / objection (Art. 18, 21) / other | By request to henrik@henriknordquist.dk |
| Complaint | To Datatilsynet (datatilsynet.dk) |
