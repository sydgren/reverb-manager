# reverb-host

A self-contained Reverb WebSocket broadcaster. No application code, no
models, no auth — just the Pusher-protocol daemon. Multi-app friendly
out of the box.

Any Laravel app can point at it. Channel authorization stays in the
consuming app via `/broadcasting/auth`; Reverb only verifies the HMAC
signature against the shared secret.

## Build & run

```bash
docker build -t webhook-dev/reverb ./reverb-host
docker run --rm -p 8080:8080 \
  -e REVERB_APP_ID=local \
  -e REVERB_APP_KEY=local \
  -e REVERB_APP_SECRET=secret \
  webhook-dev/reverb
```

Or with the project's `compose.yml`:

```bash
docker compose up reverb -d
```

## Multi-app

Pass a JSON array of apps via the `REVERB_APPS` env var. When set, it
takes precedence over `REVERB_APP_ID/KEY/SECRET`. Each entry needs at
minimum `app_id`, `key`, `secret`. Everything else falls back to
sensible defaults (allowed origins `*`, ping 60s, activity 30s, etc).

```bash
docker run --rm -p 8080:8080 \
  -e REVERB_APPS='[
    {"app_id":"webhook-dev","key":"wd-key","secret":"wd-sec","allowed_origins":["https://hooks.example.com"]},
    {"app_id":"crm","key":"crm-key","secret":"crm-sec","allowed_origins":["https://crm.example.com"]}
  ]' \
  webhook-dev/reverb
```

Adding a new app means adding an entry to the JSON, no rebuild —
just restart the container (or run `php artisan reverb:restart`
inside it for graceful reload).

## Pointing a Laravel app at it

In the consuming app's `.env`:

```env
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=webhook-dev
REVERB_APP_KEY=wd-key
REVERB_APP_SECRET=wd-sec
REVERB_HOST=ws.hooks.example.com
REVERB_PORT=443
REVERB_SCHEME=https

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

Channel auth definitions live entirely in the consuming app's
`routes/channels.php`. The Reverb daemon never sees them.

## Production deployment notes

- **Nginx must proxy both `/app` (WebSocket) and `/apps` (HTTP broadcast API)** to the Reverb container — the docs are explicit about this.
- For >1000 concurrent connections, install `ext-uv` for an event loop that scales beyond `stream_select`'s 1024-fd ceiling.
- Bump system limits (`/etc/security/limits.conf` `nofile 10000`) if you expect heavy concurrency.
- Horizontal scaling: set `REVERB_SCALING_ENABLED=true` and provide a Redis URL — Reverb instances coordinate via Redis pub/sub.
- Graceful restart after config or code changes: `php artisan reverb:restart`.
- Pulse integration: separate `pulse:check` daemon, on **one** server only when scaled out.
