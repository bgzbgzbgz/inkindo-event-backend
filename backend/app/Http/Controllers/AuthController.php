<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // === FUNGSI REGISTER ===
    public function register(Request $request)
    {
        // 1. Validasi data yang dikirim dari Front-end
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'phone'    => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        // 2. Simpan ke database (otomatis jadi 'member' & status 'pending')
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
            'role'     => 'member', // Sesuai default migration kita
            'status'   => 'pending' // Sesuai UI, nunggu divalidasi
        ]);

        // 3. Kasih balikan sukses ke FE
        return response()->json([
            'success' => true,
            'message' => 'Registrasi akun berhasil! Silakan login.',
            'data'    => $user
        ], 201);
    }

    // === FUNGSI LOGIN ===
    public function login(Request $request)
    {
        // 1. Validasi inputan login
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // 2. Cek apakah email dan password cocok di database
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau Kata Sandi salah!'
            ], 401);
        }

        // 3. Bikin Token Rahasia buat user yang berhasil login
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Balikin Token & data user ke Front-end
        return response()->json([
            'success' => true,
            'message' => 'Berhasil Login!',
            'data'    => $user,
            'token'   => $token 
        ]);
    }
        public function logout(Request $request)
    {
        // Menghapus token user yang sedang login saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ]);
    }
}