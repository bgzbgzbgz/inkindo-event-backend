<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Judul Acara
            $table->text('description')->nullable(); // Deskripsi (Bisa kosong)
            $table->date('event_date'); // Tanggal Acara
            $table->string('location')->nullable(); // Lokasi
            $table->string('status')->default('upcoming'); // Status: upcoming, ongoing, completed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
