<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'code',
        'name',
        'address',
        'phone',
        'email',
        'npwp'
    ];
    // public function transactions()
    // {
    //     return $this->hasMany(Transaction::class);
    // }
}
