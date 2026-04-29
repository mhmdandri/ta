<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['code', 'name', 'description', 'type', 'price'];
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
    public function stocks()
    {
        return $this->hasMany(ProductStock::class);
    }
    public function getTotalStockAttribute()
    {
        return $this->stockts()->sum('stock');
    }
}
