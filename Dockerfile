# A self-contained Reverb broadcaster — no application code, no models,
# no auth. Reverb is a Pusher-protocol WebSocket server: it only knows
# about app credentials. Each consuming Laravel app owns its own
# /broadcasting/auth route and signs subscriptions with the same secret.

FROM php:8.5-cli-alpine AS build

RUN apk add --no-cache git unzip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /opt

RUN composer create-project laravel/laravel app --prefer-dist --no-interaction --no-progress \
    && cd app \
    && composer require laravel/reverb --no-interaction --no-progress \
    && php artisan key:generate --force

# ───────────────────────────────────────────────────────────────────────

FROM php:8.5-cli-alpine

RUN apk add --no-cache linux-headers \
    && docker-php-ext-install pcntl sockets \
    && docker-php-ext-enable pcntl sockets

COPY --from=build /opt/app /app

WORKDIR /app

EXPOSE 8080

ENV REVERB_SERVER_HOST=0.0.0.0
ENV REVERB_SERVER_PORT=8080
ENV BROADCAST_CONNECTION=reverb

CMD ["php", "artisan", "reverb:start"]
