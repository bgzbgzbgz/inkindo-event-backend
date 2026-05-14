<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Memanggil Seeder lain agar ikut dijalankan
    $this->call([

        EventSeeder::class,
        ]);
        // Bikin akun Admin Permanen
        User::create([
            'name' => 'Super Admin INKINDO',
            'email' => 'admin@inkindo.org',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        // (Opsional) Bikin satu akun member biasa buat bahan testing
        User::create([
            'name' => 'Member Biasa',
            'email' => 'member@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'member',
            'status' => 'active',
            'nta' => 'NTA-123456'
        ]);
    }
}
