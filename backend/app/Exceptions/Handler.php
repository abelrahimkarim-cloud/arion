<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Throwable;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class Handler extends ExceptionHandler
{
    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Convert an authentication exception into an unauthenticated response.
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        $payload = [
            'status' => false,
            'code' => 401,
            'message' => 'Unauthorized',
        ];

        return response()->json($payload, 401);
    }

    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson() || $request->wantsJson() || $request->is('api/*')) {
            if ($exception instanceof AuthenticationException) {
                return $this->unauthenticated($request, $exception);
            }

            if ($exception instanceof TokenExpiredException) {
                return response()->json([
                    'status' => false,
                    'code' => 401,
                    'message' => 'Token expired',
                ], 401);
            }

            if ($exception instanceof TokenInvalidException) {
                return response()->json([
                    'status' => false,
                    'code' => 401,
                    'message' => 'Token invalid',
                ], 401);
            }

            if ($exception instanceof TokenBlacklistedException) {
                return response()->json([
                    'status' => false,
                    'code' => 401,
                    'message' => 'Token blacklisted',
                ], 401);
            }

            if ($exception instanceof JWTException || $exception instanceof UnauthorizedHttpException) {
                return response()->json([
                    'status' => false,
                    'code' => 401,
                    'message' => 'Unauthorized',
                ], 401);
            }

            if (method_exists($exception, 'getStatusCode')) {
                $status = $exception->getStatusCode();
                $message = $exception->getMessage() ?: 'Error';

                return response()->json([
                    'status' => false,
                    'code' => $status,
                    'message' => $message,
                ], $status);
            }

            return response()->json([
                'status' => false,
                'code' => 500,
                'message' => 'Server Error',
            ], 500);
        }

        return parent::render($request, $exception);
    }
}
