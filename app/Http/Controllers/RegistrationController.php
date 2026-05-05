<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    // === FUNGSI UPLOAD BUKTI BAYAR ===
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'payment_proof' => 'required|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        // Simpan file ke folder storage/app/public/payments
        $path = $request->file('payment_proof')->store('payments', 'public');

        $registration = Registration::create([
            'user_id' => auth()->id(), // Ngambil ID dari Token
            'event_id' => $request->event_id,
            'payment_proof' => $path,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran berhasil, tunggu verifikasi admin!',
            'data' => $registration
        ]);
    }

    // === FUNGSI LIHAT HISTORY (UNTUK MEMBER) ===
    public function history()
    {
        // Tarik data pendaftaran milik user yang lagi login, sekalian bawa data event-nya
        $registrations = Registration::with('event')
                            ->where('user_id', auth()->id())
                            ->latest()
                            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil riwayat pendaftaran',
            'data'    => $registrations
        ]);
    }

    // === FUNGSI VERIFIKASI (KHUSUS ADMIN) ===
    public function updateStatus(Request $request, $id)
    {
        // 1. Cek apakah yang ngeklik ini beneran Admin INKINDO
        if (auth()->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akses Ditolak! Hanya Admin yang bisa verifikasi.'
            ], 403);
        }

        // 2. Validasi inputan status
        $request->validate([
            'status' => 'required|in:verified,rejected'
        ]);

        // 3. Cari data pendaftarannya & update
        $registration = Registration::findOrFail($id);
        $registration->update([
            'status' => $request->status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diubah menjadi ' . $request->status,
            'data'    => $registration
        ]);
    }
}