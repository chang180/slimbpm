# Deployment Guide

This guide describes a conventional staging or production deployment for SlimBPM. It assumes a Linux server or managed Laravel host running PHP-FPM, a web server, a production database, Node.js for asset builds, and a process monitor for queues.

SlimBPM core MVP modules are Green and 262 automated tests pass. **Phase 3.5E** requires a staging deployment using this guide and a manual smoke checklist recorded in [`.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md`](../.ai-dev/tasks/phase-3.5-mvp-convergence/progress.md). Do not skip staging validation before Phase 4 expansion.

## 1. Prerequisites

- PHP 8.4 recommended. `composer.json` allows PHP `^8.2`, but the audited environment is PHP 8.4.
- Composer 2.
- Node.js and npm compatible with Vite 7.
- A production database: MySQL or PostgreSQL is recommended for production. SQLite is acceptable for local development and small staging environments only.
- A web server that can serve Laravel from `public/` through PHP-FPM.
- A process monitor such as Supervisor, systemd, Laravel Forge, Laravel Cloud, or another platform queue worker manager.
- Write access for the deploy user to `storage/` and `bootstrap/cache/`.

## 2. Environment Variables

Start by copying `.env.example` to `.env` and setting production values.

Core application settings:

| Variable | Production guidance |
|----------|---------------------|
| `APP_NAME` | Human-readable application name. |
| `APP_ENV` | Use `production` for production and `staging` for staging. |
| `APP_KEY` | Generate once with `php artisan key:generate`; never rotate casually because encrypted data and sessions depend on it. |
| `APP_DEBUG` | Must be `false` outside local development. |
| `APP_URL` | Canonical HTTPS URL, for example `https://bpm.example.com`. |
| `APP_LOCALE`, `APP_FALLBACK_LOCALE` | Keep aligned with product language expectations. |

Database settings:

| Variable | Production guidance |
|----------|---------------------|
| `DB_CONNECTION` | Use `mysql` or `pgsql` for production. Avoid production SQLite unless the deployment is intentionally very small and single-server. |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Set for the production database. Do not commit credentials. |

Session, cache, and queue settings:

| Variable | Production guidance |
|----------|---------------------|
| `SESSION_DRIVER` | `database` is the current default and works well with migrations. `redis` is also acceptable when Redis is provisioned. |
| `SESSION_ENCRYPT` | Consider `true` for production if the extra overhead is acceptable. |
| `SESSION_DOMAIN` | Set only when cookies must cover a specific domain or subdomain set. |
| `SESSION_SECURE_COOKIE` | Set `true` when serving over HTTPS. This variable is used by `config/session.php` even though it is not currently listed in `.env.example`. |
| `CACHE_STORE` | `database` works with existing migrations; prefer `redis` for higher traffic deployments. |
| `QUEUE_CONNECTION` | `database` is the current default. Use `redis` if Redis is available and queue volume grows. |

Mail and notifications:

| Variable | Production guidance |
|----------|---------------------|
| `MAIL_MAILER` | Use `smtp`, a transactional provider driver, or another real mail transport. `log` is for local/staging inspection only. |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | Required for SMTP. |
| `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` | Must be a verified sender for production mail. |

Other settings:

| Variable | Production guidance |
|----------|---------------------|
| `FILESYSTEM_DISK` | `local` is fine for local files. Use S3-compatible storage if user uploads must survive redeploys or multi-server scaling. |
| `AWS_*` | Required only when using S3-compatible storage or SQS. |
| `VITE_APP_NAME` | Usually mirrors `APP_NAME`. |
| `INERTIA_SSR_ENABLED` | If SSR is enabled, run the SSR process. If no SSR process is managed, set this to `false` to avoid unnecessary SSR attempts. |
| `INERTIA_SSR_URL` | Default is `http://127.0.0.1:13714`; change only if the SSR process runs elsewhere. |

## 3. Build And Release Steps

A typical release from a clean checkout looks like this:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
```

Use `npm run build:ssr` instead of `npm run build` only when the deployment intentionally runs Inertia SSR:

```bash
npm run build:ssr
php artisan inertia:stop-ssr
```

The process monitor should restart the SSR process after `inertia:stop-ssr`.

If the deployment uses public filesystem links, run this once per server:

```bash
php artisan storage:link
```

If a deploy fails after cached config/routes/views were generated, clear caches before retrying:

```bash
php artisan optimize:clear
```

## 4. Database Migration

Run migrations during deployment:

```bash
php artisan migrate --force
```

Before production migration:

- Back up the database.
- Confirm the target database engine matches `DB_CONNECTION`.
- Run migrations in staging first.
- Review migrations that alter existing columns or constraints.
- Keep application instances from writing conflicting data during the migration if a migration is long-running.

Laravel's database-backed sessions, cache, queues, failed jobs, and job batches depend on the relevant tables being present. The current migration set includes the standard tables required by the default `.env.example` settings.

## 5. Queue Worker

SlimBPM uses `QUEUE_CONNECTION=database` by default. Production deployments should run a queue worker continuously; do not rely on `queue:listen` in production.

Manual foreground command for debugging:

```bash
php artisan queue:work --tries=3 --timeout=90
```

Example Supervisor program:

```ini
[program:slimbpm-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/slimbpm/current/artisan queue:work --sleep=3 --tries=3 --timeout=90
directory=/var/www/slimbpm/current
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/slimbpm/current/storage/logs/queue-worker.log
stopwaitsecs=3600
```

After each deploy, run:

```bash
php artisan queue:restart
```

Queue workers are long-lived processes, so they need this graceful restart to pick up new code.

## 6. Scheduler

Add one cron entry for Laravel's scheduler:

```cron
* * * * * cd /var/www/slimbpm/current && php artisan schedule:run >> /dev/null 2>&1
```

Use the real deploy path. Managed hosts may provide a scheduler UI; configure the same command there.

For local development only, `php artisan schedule:work` can run in the foreground.

## 7. Mail

Notifications and invitations depend on mail configuration when emails should leave the system.

For local development and non-email staging checks:

```dotenv
MAIL_MAILER=log
```

For production, configure SMTP or a transactional mail provider:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM_ADDRESS=no-reply@example.com
MAIL_FROM_NAME="${APP_NAME}"
```

Verify the sender domain with the mail provider before enabling real invitation or notification flows.

## 8. SQLite To MySQL Or PostgreSQL

SQLite is the default development database in `.env.example`. For production, prefer MySQL or PostgreSQL:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=slimbpm
DB_USERNAME=slimbpm
DB_PASSWORD=...
```

Migration notes:

- Treat SQLite data migration as a separate data export/import task, not just an `.env` change.
- Back up the SQLite file before exporting.
- Create the production database and credentials before running `php artisan migrate --force`.
- Test imports in staging and compare row counts for important tables.
- Review foreign keys and timestamp formats after import.

If production starts fresh, do not copy the SQLite file. Point `.env` at the production database and run migrations.

## 9. Web Server

The web server document root must point to the Laravel `public/` directory, not the repository root.

Minimal Nginx shape:

```nginx
server {
    listen 80;
    server_name bpm.example.com;
    root /var/www/slimbpm/current/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Use HTTPS in production, either at the web server, load balancer, or managed platform layer.

## 10. Inertia SSR

`config/inertia.php` defaults `INERTIA_SSR_ENABLED` to `true`. Choose one deployment mode:

Client-side rendering only:

```dotenv
INERTIA_SSR_ENABLED=false
```

SSR enabled:

```bash
npm run build:ssr
php artisan inertia:start-ssr
```

Run `inertia:start-ssr` under Supervisor or another process monitor. After deploys, stop it gracefully so the process monitor restarts it with the new bundle:

```bash
php artisan inertia:stop-ssr
php artisan inertia:check-ssr
```

## 11. Post-Deploy Verification

For staging, run the full quality gate:

```bash
composer validate --strict
php artisan test
npm run types
npm run build
```

For production, avoid running destructive or slow checks against live data unless your deployment process isolates them. At minimum verify:

- `/` loads over HTTPS.
- Login and logout work.
- Authenticated dashboard loads for a seeded or real organization user.
- Invitations and notifications can send mail in staging.
- Queue worker is running and processing jobs.
- Scheduler cron is registered.
- `storage/logs/laravel.log` has no new deploy-time errors.
- `php artisan migrate:status` shows expected migrations.
- If SSR is enabled, `php artisan inertia:check-ssr` passes.

## 12. Rollback

Keep rollback practical:

- Keep the previous release directory or artifact available.
- Keep a database backup before every production migration.
- Record the exact commit SHA deployed.
- If a deployment fails before migrations, switch the web root or release symlink back to the previous artifact.
- If a deployment fails after migrations, evaluate whether a database restore is needed before rollback.
- Run `php artisan queue:restart` after rollback so workers use the restored code.

## 13. Known Limitations

- Phase 3.5E staging manual smoke checklist must be completed before treating MVP as validated for go-live.
- `/form-builder` is a localStorage demo with a warning banner; use `/forms/create` for persisted forms.
- No dedicated workflow template edit page — use designer/create flow.
- Pest Browser smoke tests are available (`tests/Browser/SmokeTest.php`); run `npm run build` then `php artisan test tests/Browser` on staging before go-live.
