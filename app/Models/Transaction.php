<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'customer_id',
        'sales_id',
        'operate_fee',
        'no_penawaran',
        'no_po',
        'termin_of_payment',
        'payment',
        'total_pricelist',
        'price_deal',
        'total_discount',
        'total_net',
        'extra_discount',
        'total_net_net',
        'is_ppn',
        'ppn_value',
        'total_final',
        'transaction_type',
        'rental_start',
        'rental_end',
        'install_date',
        'uninstall_date',
        'rental_duration',
        'offer_counter_id',
        'description',
        'pic',
        'location',
        'jenis_instalasi',
        'delivery',
    ];
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Relasi ke sales (user)
    public function sales()
    {
        return $this->belongsTo(User::class, 'sales_id');
    }

    // Relasi ke item
    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }
    public function offerCounter()
    {
        return $this->belongsTo(OfferCounter::class, 'offer_counter_id');
    }
}
