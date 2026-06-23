<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('cookie', function ($app) {
            $config = $app->make('config')->get('session', []);
            $path = $config['path'] ?? '/';
            $domain = $config['domain'] ?? null;
            $secure = $config['secure'] ?? false;
            $sameSite = $config['same_site'] ?? null;

            return new \Illuminate\Cookie\CookieJar(
                $app->make('encrypter'),
                $path,
                $domain,
                $secure,
                $sameSite
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
    }
}
