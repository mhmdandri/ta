<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next, string $roles): Response
  {
    $user = $request->user();
    if (! $user) {
      return redirect()->route('login'); // kalau belum login
    }

    // pisahkan role dengan | atau , misalnya "admin|sales"
    $allowedRoles = array_map('trim', preg_split('/[|,]/', $roles));

    if (! in_array($user->role, $allowedRoles, true)) {
      abort(403); // atau redirect()->route('dashboard')->with('error','Tidak punya akses');
    }

    return $next($request);
  }
}
