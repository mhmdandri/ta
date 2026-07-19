# syntax=docker/dockerfile:1

FROM php:8.2-cli-bookworm AS vendor
WORKDIR /app
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip \
    && rm -rf /var/lib/apt/lists/*
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

FROM node:22-bookworm-slim AS frontend
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        php8.2-cli \
        php8.2-mbstring \
        php8.2-xml \
        php8.2-curl \
        php8.2-zip \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY vite.config.ts tsconfig.json eslint.config.js components.json ./
COPY resources ./resources
COPY public ./public
COPY artisan .
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY database ./database
COPY routes ./routes
COPY --from=vendor /app/vendor ./vendor
ENV WAYFINDER_DISABLE=1
RUN npm run build

FROM php:8.2-cli-bookworm AS app
WORKDIR /var/www/html

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    PATH="/var/www/html/vendor/bin:${PATH}"

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        git \
        libicu-dev \
        libonig-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-install \
        intl \
        mbstring \
        opcache \
        pcntl \
        pdo_mysql \
        zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build
COPY . .

RUN mkdir -p storage bootstrap/cache \
    && php artisan package:discover --ansi || true \
    && php artisan storage:link || true

EXPOSE 8000

CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=8000"]