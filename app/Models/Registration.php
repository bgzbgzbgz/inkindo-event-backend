<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    // Biar kita bisa masukin data user_id, event_id, dll secara langsung
    protected $guarded = ['id'];

    // Bikin relasi ke tabel users (siapa yang daftar)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Bikin relasi ke tabel events (daftar acara apa)
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}