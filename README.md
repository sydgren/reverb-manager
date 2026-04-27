# reverb-host

A self-contained Reverb WebSocket broadcaster. No application code, no
models, no auth — just the Pusher-protocol daemon.

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

## Multiple apps

To serve more than one Laravel project from the same Reverb instance,
publish the config (`php artisan vendor:publish --tag=reverb-config`)
and add additional apps to the `apps.apps` array. Each app gets its own
`app_id`/`key`/`secret` triplet. Bake the modified config into a custom
image, or mount it as a volume.

## Pointing a Laravel app at it

In the consuming app's `.env`:

```env
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=local
REVERB_APP_KEY=local
REVERB_APP_SECRET=secret
REVERB_HOST=ws.hooks.example.com   # public hostname clients connect to
REVERB_PORT=443
REVERB_SCHEME=https

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

Channel auth definitions live entirely in the consuming app's
`routes/channels.php`. The Reverb daemon never sees them.
