<?php

namespace App\Http\Middleware;

use Closure;

class AddQueuedCookiesToResponse
{
    public function handle($request, Closure $next)
    {
        return $next($request);
    }
}
