<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Transactions;

class OfferCounter extends Model
{
    protected $fillable = [
        'scope_key',
        'counter',
    ];

    /**
     * Relasi ke Transaction
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'offer_counter_id');
    }
}
