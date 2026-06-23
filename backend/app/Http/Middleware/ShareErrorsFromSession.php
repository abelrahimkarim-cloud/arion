<?php

namespace App\Http\Middleware;

use Closure;

class ShareErrorsFromSession
{
    public function handle($request, Closure $next)
    {
        return $next($request);
    }
}
