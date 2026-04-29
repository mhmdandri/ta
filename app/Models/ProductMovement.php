<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductMovement extends Model
{
    protected $fillable = [
        'product_id',
        'kode_gudang',
        'qty',
        'type',
        'transaction_id',
    ];
}
