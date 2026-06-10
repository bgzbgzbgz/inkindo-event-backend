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


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events/register', [RegistrationController::class, 'store']);
    Route::post('/events/scan-ticket', [RegistrationController::class, 'scanTicket']);
    Route::get('/history', [RegistrationController::class, 'history']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::put('/user', function (Request $request) {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string',
            'nta' => 'nullable|string',
            'profession' => 'nullable|string',
            'company' => 'nullable|string',
            'company_email' => 'nullable|string|email',
        ]);
        
        $user->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui!',
            'data' => $user
        ]);
    });

    // Admin Event Management
    Route::post('/events', [\App\Http\Controllers\EventController::class, 'store']);
    Route::put('/events/{id}', [\App\Http\Controllers\EventController::class, 'update']);
    Route::delete('/events/{id}', [\App\Http\Controllers\EventController::class, 'destroy']);
    Route::get('/events/{id}', [\App\Http\Controllers\EventController::class, 'show']);
    Route::get('/registrations', [\App\Http\Controllers\RegistrationController::class, 'index']);
    Route::put('/admin/registrations/{id}/status', [RegistrationController::class, 'updateStatus']);
});
