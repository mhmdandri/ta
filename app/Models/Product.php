<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['code', 'name', 'description', 'type', 'price', 'stock', 'kode_gudang'];
    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];
    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
    public function priceList()
    {
        return $this->hasOne(Pricelist::class);
    }
}
