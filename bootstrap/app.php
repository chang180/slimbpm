<?php

use App\Http\Middleware\EnsureOrganizationAccess;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Session\Middleware\StartSession;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // 覆蓋默認的 RedirectIfAuthenticated 中間件
        $middleware->web(replace: [
            RedirectIfAuthenticated::class => App\Http\Middleware\RedirectIfAuthenticated::class,
        ]);

        // 註冊中間件別名
        $middleware->alias([
            'org.access' => EnsureOrganizationAccess::class,
            'guest' => App\Http\Middleware\RedirectIfAuthenticated::class,
        ]);

        // SPA 從同源 fetch API 時需共用 session（通知鈴等）
        $middleware->api(prepend: [
            EncryptCookies::class,
            AddQueuedCookiesToResponse::class,
            StartSession::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
