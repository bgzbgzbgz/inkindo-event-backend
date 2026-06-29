<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        // Check if requesting user is authenticated as admin
        $user = auth('sanctum')->user();
        if ($user && $user->role === 'admin') {
            $events = Event::with('category')->latest()->get();
        } else {
            $events = Event::with('category')
                ->where(function ($query) {
                    $query->where('publish_status', 'published')
                          ->orWhere(function ($q) {
                              $q->where('publish_status', 'scheduled')
                                ->where('scheduled_publish_at', '<=', now());
                          })
                          ->orWhereNull('publish_status');
                })
                ->latest()
                ->get();
        }

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
            'publish_status' => 'required|in:draft,published,scheduled',
            'scheduled_publish_at' => 'required_if:publish_status,scheduled|nullable|date',
            'ad_image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'poster_file' => 'nullable|file|mimes:jpg,png,jpeg,pdf|max:5120',
        ]);

        $data = $request->except(['ad_image', 'poster_file', 'agenda']);

        // Handle agenda JSON string
        if ($request->has('agenda') && !empty($request->agenda)) {
            $data['agenda'] = json_decode($request->agenda, true);
        }

        // Handle ad_image file upload
        if ($request->hasFile('ad_image')) {
            $data['ad_image'] = $request->file('ad_image')->store('events/ads', 'public');
        }

        // Handle poster_file upload (image/pdf)
        if ($request->hasFile('poster_file')) {
            $data['poster_file'] = $request->file('poster_file')->store('events/posters', 'public');
        }

        $event = Event::create($data);

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

        $request->validate([
            'title' => 'required|string',
            'event_date' => 'required|date',
            'publish_status' => 'required|in:draft,published,scheduled',
            'scheduled_publish_at' => 'required_if:publish_status,scheduled|nullable|date',
            'ad_image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'poster_file' => 'nullable|file|mimes:jpg,png,jpeg,pdf|max:5120',
        ]);

        $data = $request->except(['ad_image', 'poster_file', 'agenda']);

        // Handle agenda JSON string
        if ($request->has('agenda') && !empty($request->agenda)) {
            $data['agenda'] = json_decode($request->agenda, true);
        }

        // Handle ad_image file upload
        if ($request->hasFile('ad_image')) {
            $data['ad_image'] = $request->file('ad_image')->store('events/ads', 'public');
        }

        // Handle poster_file upload
        if ($request->hasFile('poster_file')) {
            $data['poster_file'] = $request->file('poster_file')->store('events/posters', 'public');
        }

        $event->update($data);

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