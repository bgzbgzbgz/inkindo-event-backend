<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Relasi ke tabel kategori
            // $table->foreignId('category_id')->nullable()->after('id')->constrained('event_categories')->nullOnDelete();
            
            // Detail event sesuai form "Rilis Event Baru"
            // $table->string('location')->nullable()->after('title'); // Lokasi / Titik Kumpul
            // $table->date('event_date')->nullable()->after('location'); // Tanggal Pelaksanaan
            $table->string('event_time')->nullable()->after('event_date'); // Waktu (Zona WIB)
            $table->boolean('is_free')->default(true)->after('event_time'); // Gratis atau berbayar
            $table->decimal('price', 15, 2)->nullable()->after('is_free'); // Harga tiket (kalau berbayar)
            $table->string('image_url')->nullable()->after('description'); // Visual Sampul URL/Path
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Kosongin aja biar aman, karena kolomnya ternyata udah dibikin di awal
        });
    }
};