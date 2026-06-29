<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    // Biar semua kolom bisa diisi langsung
    protected $guarded = ['id'];

    protected $casts = [
        'agenda' => 'array',
        'is_free' => 'boolean',
    ];

    // Bikin relasi ke tabel event_categories
    public function category()
    {
        return $this->belongsTo(EventCategory::class, 'category_id');
    }
}