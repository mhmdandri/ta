<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManagerTarget extends Model
{
  use HasFactory;

  protected $fillable = [
    'manager_id',
    'period',
    'target_amount',
  ];

  protected $casts = [
    'period' => 'date',
    'target_amount' => 'decimal:2',
  ];

  /**
   * Relasi ke Manager (User dengan role manager)
   */
  public function manager()
  {
    return $this->belongsTo(User::class, 'manager_id');
  }

  /**
   * Scope untuk filter berdasarkan periode
   */
  public function scopeForPeriod($query, $period)
  {
    return $query->where('period', $period);
  }

  /**
   * Scope untuk filter berdasarkan Manager
   */
  public function scopeForManager($query, $managerId)
  {
    return $query->where('manager_id', $managerId);
  }
}
