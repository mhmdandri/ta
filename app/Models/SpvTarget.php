<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpvTarget extends Model
{
  use HasFactory;

  protected $fillable = [
    'spv_id',
    'period',
    'target_amount',
  ];

  protected $casts = [
    'period' => 'date',
    'target_amount' => 'decimal:2',
  ];

  /**
   * Relasi ke SPV (User dengan role spv)
   */
  public function spv()
  {
    return $this->belongsTo(User::class, 'spv_id');
  }

  /**
   * Scope untuk filter berdasarkan periode
   */
  public function scopeForPeriod($query, $period)
  {
    return $query->where('period', $period);
  }

  /**
   * Scope untuk filter berdasarkan SPV
   */
  public function scopeForSpv($query, $spvId)
  {
    return $query->where('spv_id', $spvId);
  }
}
