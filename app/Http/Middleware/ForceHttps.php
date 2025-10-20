<?php

namespace App\Http\Middleware;

use Closure;

class ForceHttps
{
  public function handle($request, Closure $next)
  {
    // Pastikan hanya redirect kalau BENAR-BENAR belum HTTPS
    if (
      !$request->secure() &&
      app()->environment('production') &&
      !$request->headers->has('x-forwarded-proto')
    ) {
      return redirect()->secure($request->getRequestUri());
    }

    return $next($request);
  }
}
