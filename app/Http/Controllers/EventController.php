<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        // Narik semua data event beserta nama kategorinya
        $events = Event::with('category')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data event INKINDO',
            'data'    => $events
        ]);
    }
}