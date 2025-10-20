<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Symfony\Component\HttpFoundation\Request;

class TrustProxies extends Middleware
{
  /**
   * Terima semua proxy (Heroku, VPS Nginx, Cloudflare, dll)
   */
  protected $proxies = '*';

  /**
   * Header yang digunakan untuk deteksi proto/host dari proxy
   */
  protected $headers =
  Request::HEADER_X_FORWARDED_FOR |
    Request::HEADER_X_FORWARDED_HOST |
    Request::HEADER_X_FORWARDED_PORT |
    Request::HEADER_X_FORWARDED_PROTO;
}
