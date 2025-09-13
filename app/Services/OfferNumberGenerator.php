<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OfferNumberGenerator
{
  /**
   * Format nomor: 0001/COR/K02/MM/YYYY
   * Reset per bulan (berdasarkan $refDate; default: sekarang).
   * Return: ['no_penawaran' => string, 'offer_counter_id' => int]
   */
  public function generate(
    string $companyCode = 'COR',
    string $branchCode = 'K02',
    ?Carbon $refDate = null
  ): array {
    $now   = $refDate ?: Carbon::now();
    $ym    = $now->format('Y-m'); // contoh: 2025-09
    $mm    = $now->format('m');   // 09
    $yyyy  = $now->format('Y');   // 2025

    $scopeKey = "{$companyCode}/{$branchCode}/{$ym}";

    return DB::transaction(function () use ($scopeKey, $companyCode, $branchCode, $mm, $yyyy) {
      // lock baris counter utk scope ini
      $row = DB::table('offer_counters')
        ->where('scope_key', $scopeKey)
        ->lockForUpdate()
        ->first();

      $id = null;
      if (!$row) {
        // buat baris baru dan ambil id-nya
        $id = DB::table('offer_counters')->insertGetId([
          'scope_key'  => $scopeKey,
          'counter'    => 0,
          'created_at' => now(),
          'updated_at' => now(),
        ]);

        // reselect dengan lock agar konsisten
        $row = DB::table('offer_counters')
          ->where('id', $id)
          ->lockForUpdate()
          ->first();
      } else {
        // ambil id baris existing
        $id = $row->id;
      }

      $next = ((int) $row->counter) + 1;

      DB::table('offer_counters')
        ->where('id', $id)
        ->update([
          'counter'    => $next,
          'updated_at' => now(),
        ]);

      $seq4 = str_pad((string) $next, 4, '0', STR_PAD_LEFT);
      $noPen = "{$seq4}/{$companyCode}/{$branchCode}/{$mm}/{$yyyy}";

      return [
        'no_penawaran'     => $noPen,
        'offer_counter_id' => $id,
      ];
    });
  }
}
