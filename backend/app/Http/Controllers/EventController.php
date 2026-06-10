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
    // 1. Mengambil salah satu event (Detail)
    public function show($id)
    {
        $event = Event::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $event
        ]);
    }

    // 2. Menambahkan event untuk admin
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'event_date' => 'required|date',
            // tambahkan validasi lain sesuai kolom database lu
        ]);

        $event = Event::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil ditambahkan',
            'data' => $event
        ], 201);
    }

    // 3. Mengubah data event
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $event->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil diubah',
            'data' => $event
        ]);
    }

    // 4. Menghapus event
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil dihapus'
        ]);
    }
}