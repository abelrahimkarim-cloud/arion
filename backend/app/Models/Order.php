<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'variant_id',
        'status',
        'quantity',
        'total_price',
        'notes',
        'city',
        'address',
        'whatsapp_sent',
    ];

    protected $casts = [
        'whatsapp_sent' => 'boolean',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
