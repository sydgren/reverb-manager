# reverb-host

Reverb deployed as a Supervisor-managed daemon on the server. No
container, no orchestration — just a long-running PHP process that the
host supervises.

The directory contains two reusable artifacts:

| File | Purpose |
|------|---------|
| [`config/reverb.php`](config/reverb.php) | Multi-app friendly Reverb config — drop into the broadcaster's `config/` directory after `vendor:publish` |
| [`supervisor/reverb.conf`](supervisor/reverb.conf) | Sample Supervisor program — drop into `/etc/supervisor/conf.d/` |

## Setup on a fresh server

1. Provision a thin Laravel app on the server (e.g. via Forge — call the site `reverb`):
   ```bash
   composer create-project laravel/laravel /home/forge/reverb
   cd /home/forge/reverb
   composer require laravel/reverb
   php artisan key:generate
   ```
2. Replace `config/reverb.php` with the version from this directory.
3. Set credentials in `.env`:
   ```env
   REVERB_APP_ID=webhook-dev
   REVERB_APP_KEY=...
   REVERB_APP_SECRET=...
   REVERB_SERVER_HOST=0.0.0.0
   REVERB_SERVER_PORT=8080
   ```
   Or for multiple apps:
   ```env
   REVERB_APPS='[
     {"app_id":"webhook-dev","key":"...","secret":"...","allowed_origins":["https://hooks.example.com"]},
     {"app_id":"crm","key":"...","secret":"...","allowed_origins":["https://crm.example.com"]}
   ]'
   ```
4. Drop `supervisor/reverb.conf` into `/etc/supervisor/conf.d/reverb.conf`, adjust paths, then:
   ```bash
   sudo supervisorctl reread
   sudo supervisorctl update
   sudo supervisorctl status reverb
   ```
5. Front it with Nginx — proxy **both** `/app` (WebSocket) and `/apps` (broadcast API):
   ```nginx
   server {
       server_name ws.hooks.example.com;
       listen 443 ssl http2;

       location /app {
           proxy_pass http://127.0.0.1:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "Upgrade";
           proxy_read_timeout 60m;
           proxy_set_header Host $host;
       }

       location /apps {
           proxy_pass http://127.0.0.1:8080;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
       }
   }
   ```

## Graceful reloads

Always graceful — never `kill` or `supervisorctl restart`:

```bash
sudo -u forge php /home/forge/reverb/artisan reverb:restart
```

The command signals the daemon to drain existing connections and exit
cleanly; Supervisor brings it back up immediately. No client sees a
hung connection.

For Forge specifically, you can wire this into the deploy script of
the broadcaster site so every push triggers a graceful reload.

## Multi-app config behaviour

The published `config/reverb.php`:

- If `REVERB_APPS` is set (JSON array), it overrides everything else
  and builds the apps list from the array. Each entry needs at minimum
  `app_id`, `key`, `secret`. Other fields fall back to sensible
  defaults (allowed origins `*`, ping 60s, activity 30s, rate limits
  off).
- Otherwise falls back to a single app from `REVERB_APP_ID/KEY/SECRET`
  — the same as the package default.

Adding a new app is an `.env` change + a graceful reload.

## Pointing a Laravel app at it

In the consuming app's `.env`:

```env
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=webhook-dev
REVERB_APP_KEY=...
REVERB_APP_SECRET=...
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

## Production tuning notes (from the docs)

- For >1000 concurrent connections, install `ext-uv` (`pecl install uv`).
  Reverb auto-detects it and switches event loops.
- Bump `nofile` limits (`/etc/security/limits.conf`) and Supervisor's
  `minfds` if you expect heavy concurrency.
- Horizontal scaling: `REVERB_SCALING_ENABLED=true` + Redis credentials.
  Multiple Reverb hosts coordinate via Redis pub/sub.
- Pulse integration: run a single `pulse:check` daemon when scaled out.
