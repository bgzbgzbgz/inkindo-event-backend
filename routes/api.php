<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegistrationController;


// Pintu terbuka (siapa aja bisa liat)
Route::get('/events', [EventController::class, 'index']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Pintu terkunci (harus bawa Token)
Route::middleware('auth:sanctum')->group(function () {
    // Lu bisa tambahin rute buat 'Logout' atau 'Profile' di sini nanti
    Route::post('/events/register', [RegistrationController::class, 'store']);
    Route::post('/events/scan-ticket', [RegistrationController::class, 'scanTicket']);

    // Rute Liat History Member
    Route::get('/history', [RegistrationController::class, 'history']);
    
    // Rute Verifikasi Admin (Pakai method PUT/PATCH buat update)
    Route::put('/admin/registrations/{id}/status', [RegistrationController::class, 'updateStatus']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
