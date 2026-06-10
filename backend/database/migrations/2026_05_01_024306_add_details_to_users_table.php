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
        Schema::table('users', function (Blueprint $table) {
            // Nambahin role (Administrator atau Anggota)
            $table->enum('role', ['admin', 'member'])->default('member')->after('password');
            
            // Data profil tambahan sesuai UI dan Notulen
            $table->string('nta')->nullable()->after('role'); // Nomor Tanda Anggota
            $table->string('profession')->nullable()->after('nta'); // Profesi / Posisi
            $table->string('company')->nullable()->after('profession'); // Perusahaan / Instansi
            $table->string('phone')->nullable()->after('company'); // No. HP / WA
            $table->string('company_email')->nullable()->after('phone'); // Email Kantor
            
            // Status keanggotaan (Active / Pending)
            $table->enum('status', ['active', 'pending'])->default('pending')->after('company_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 
                'nta', 
                'profession', 
                'company', 
                'phone', 
                'company_email', 
                'status'
            ]);
        });
    }
};