<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $origin = $request->header('Origin');
        
        // Determine if this is an allowed origin
        $isNgrok = $origin && (strpos($origin, 'ngrok') !== false);
        $isLocalhost = $origin && (strpos($origin, 'localhost') !== false || strpos($origin, '127.0.0.1') !== false);
        $isAllowed = $isNgrok || $isLocalhost;
        
        // Use the actual origin if allowed, otherwise use a sensible default
        $responseOrigin = $isAllowed && $origin ? $origin : '*';

        if ($request->isMethod('OPTIONS')) {
            return response()->noContent(204)
                ->header('Access-Control-Allow-Origin', $responseOrigin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, ngrok-skip-browser-warning')
                ->header('Access-Control-Allow-Credentials', $isAllowed ? 'true' : 'false')
                ->header('Access-Control-Max-Age', '86400');
        }

        $response = $next($request);

        $response->header('Access-Control-Allow-Origin', $responseOrigin);
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, ngrok-skip-browser-warning');
        $response->header('Access-Control-Allow-Credentials', $isAllowed ? 'true' : 'false');
        $response->header('Access-Control-Max-Age', '86400');
        $response->header('Vary', 'Origin');

        return $response;
    }
}
