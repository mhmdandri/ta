<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionItem extends Model
{
    protected $fillable = [
        'transaction_id',
        'product_id',
        'qty',
        'price_pricelist',
        'price_deal',
        'price_sewa',
        'discount',
        'discount_percent',
        'net_net',
        'kode_gudang',
    ];

    //  Relasi ke transaksi
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
    //  Relasi ke produk
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
