<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode; // 1. Import QrCode
use Illuminate\Support\Facades\Storage; // 2. Import Storage buat cek folder

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

        // Generate UUID untuk kode tiket (SATU KALI AJA)
        $uuid = (string) Str::uuid();

        // --- MULAI LOGIC BIKIN QR CODE ---
        // Tentukan nama file
        $qrFileName = 'qrcodes/' . $uuid . '.svg';

        // 1. Generate gambar QR Code dalam bentuk raw string (SVG)
        $qrContent = QrCode::format('svg')->size(300)->generate($uuid);

        // 2. Simpan file pakai Storage bawaan Laravel
        Storage::disk('public')->put($qrFileName, $qrContent);
        // ---------------------------------

        $registration = Registration::create([
            'user_id' => auth()->id(), // Ngambil ID dari Token
            'event_id' => $request->event_id,
            'payment_proof' => $path,
            'status' => 'pending',

            // --- PAKE VARIABEL $uuid YANG UDAH DIBIKIN DI ATAS ---
            'ticket_code' => $uuid, 
            'ticket_type' => 'regular'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran berhasil, QR Code sedang diproses!',
            'data' => $registration, // <--- INI KOMA YANG TADI KETINGGALAN
            'qr_url' => asset('storage/' . $qrFileName)
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