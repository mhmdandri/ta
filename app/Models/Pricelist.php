<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pricelist extends Model
{
    protected $fillable = [
        'product_id',
        'price_1_day',
        'price_3_days',
        'price_5_days',
        'price_7_days',
        'price_10_days',
        'price_30_days',
    ];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
