<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode; // 1. Import QrCode
use Illuminate\Support\Facades\Storage; // 2. Import Storage buat cek folder
use Illuminate\Support\Facades\Mail;
use App\Mail\TicketVerified;

class RegistrationController extends Controller
{
    // === FUNGSI MENDAFTAR EVENT (UPDATE LOGIC KTA & BYPASS RP 0) ===
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
        ]);

        $event = \App\Models\Event::findOrFail($request->event_id);
        $user = auth()->user();

        // 1. CEK KTA (NTA) UNTUK EVENT INTERNAL
        // Jika event ini internal, tapi user tidak punya NTA (KTA)
        if ($event->type === 'internal' && empty($user->nta)) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran Gagal. Event ini khusus untuk anggota asosiasi. Silakan lengkapi NTA Anda di profil terlebih dahulu.'
            ], 403);
        }

        // 2. CEK HARGA & BUKTI BAYAR (JALUR TOL SHOWCASE)
        if ($event->price == 0) {
            // EVENT GRATIS / SHOWCASE: Langsung lunas, gak butuh upload
            $path = null;
            $status = 'verified'; // Langsung terverifikasi
        } else {
            // EVENT BERBAYAR: Wajib upload bukti bayar
            $request->validate([
                'payment_proof' => 'required|image|mimes:jpg,png,jpeg|max:2048',
            ]);
            $path = $request->file('payment_proof')->store('payments', 'public');
            $status = 'pending'; // Nunggu admin
        }

        // 3. GENERATE QR CODE TIKET
        $uuid = (string) Str::uuid();
        $qrFileName = 'qrcodes/' . $uuid . '.svg';
        $qrContent = QrCode::format('svg')->size(300)->generate($uuid);
        Storage::disk('public')->put($qrFileName, $qrContent);

        // 4. SIMPAN KE DATABASE
        $registration = Registration::create([
            'user_id' => $user->id, 
            'event_id' => $request->event_id,
            'payment_proof' => $path,
            'status' => $status, // Status dinamis (verified/pending)
            'ticket_code' => $uuid, 
            'ticket_type' => 'regular'
        ]);

        // 5. RESPONS BERDASARKAN STATUS
        $message = $status === 'verified' 
            ? 'Pendaftaran berhasil! Tiket Anda sudah aktif.' 
            : 'Pendaftaran berhasil. Menunggu verifikasi pembayaran oleh Admin.';

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $registration,
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
        if (auth()->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Akses Ditolak!'], 403);
        }

        $request->validate(['status' => 'required|in:verified,rejected']);

        $registration = Registration::with(['user', 'event'])->findOrFail($id);
        $registration->update(['status' => $request->status]);

        // --- TAMBAHAN LOGIC EMAIL DI SINI ---
        if ($request->status === 'verified') {
            // Kirim email notifikasi (karena pakai log, ini bakal instan dan masuk ke storage/logs/laravel.log)
            Mail::to($registration->user->email)->send(new TicketVerified($registration));
        }

        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diubah, notifikasi email telah dikirim.',
            'data'    => $registration
        ]);
    }
    // === FUNGSI SCAN TIKET PRESENSI (UNTUK PANITIA) ===
    public function scanTicket(Request $request)
    {
        // 1. Pastikan request mengirimkan kode UUID tiket
        $request->validate([
            'ticket_code' => 'required|string'
        ]);

        // 2. Cari data registrasi berdasarkan UUID (ticket_code)
        // Kita juga tarik data user dan event-nya biar tahu siapa yang punya tiket
        $registration = Registration::with(['user', 'event'])->where('ticket_code', $request->ticket_code)->first();

        // 3. Kalau UUID ngawur / tiket nggak ketemu di database
        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket tidak valid atau tidak ditemukan di sistem!'
            ], 404);
        }

        // 4. Kalau tiketnya ternyata belum dibayar/diverifikasi
        if ($registration->status !== 'verified') {
            return response()->json([
                'success' => false,
                'message' => 'Tiket ini belum lunas atau belum diverifikasi Admin!'
            ], 400);
        }

        // 5. Kalau tiket valid, TAPI sudah pernah di-scan sebelumnya
        if ($registration->is_attended) {
            return response()->json([
                'success' => false,
                'message' => 'Tiket ini SUDAH DIGUNAKAN untuk presensi sebelumnya!'
            ], 400);
        }

        // 6. Kalau lolos semua cegatan di atas, tandai HADIR
        $registration->update([
            'is_attended' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Scan berhasil! Kehadiran telah dicatat.',
            'data' => [
                'nama_peserta' => $registration->user->name,
                'status_member' => $registration->user->nta ? 'Anggota INKINDO' : 'Umum',
            ]
        ]);
    }
}