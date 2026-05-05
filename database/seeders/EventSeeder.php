<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EventCategory;
use App\Models\Event;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Bikin Kategori Dulu
        $seminar = EventCategory::create(['name' => 'Seminar']);
        $workshop = EventCategory::create(['name' => 'Workshop']);
        $musyawarah = EventCategory::create(['name' => 'Musyawarah']);

        // 2. Bikin Event Dummy sesuai UI Figma
        Event::create([
            'category_id' => $seminar->id,
            'title'       => 'Seminar Nasional Konstruksi Baja',
            'location'    => 'Hotel JW Marriott, Surabaya',
            'event_date'  => '2026-05-15',
            'event_time'  => '08:00 - 15:00 WIB',
            'is_free'     => true,
            'price'       => null,
            'description' => 'Seminar mendalam mengenai perkembangan teknologi konstruksi baja terkini.',
            'image_url'   => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
        ]);

        Event::create([
            'category_id' => $workshop->id,
            'title'       => 'Workshop Manajemen Proyek',
            'location'    => 'Gedung INKINDO JATIM',
            'event_date'  => '2026-05-22',
            'event_time'  => '09:00 - 16:00 WIB',
            'is_free'     => false,
            'price'       => 500000,
            'description' => 'Workshop intensif untuk meningkatkan efisiensi manajemen proyek konsultan.',
            'image_url'   => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
        ]);

        Event::create([
            'category_id' => $musyawarah->id,
            'title'       => 'Musyawarah Provinsi INKINDO JATIM',
            'location'    => 'Dyandra Convention Center',
            'event_date'  => '2026-06-10',
            'event_time'  => '08:00 - SELESAI',
            'is_free'     => true,
            'price'       => null,
            'description' => 'Musyawarah tahunan seluruh anggota INKINDO regional Jawa Timur.',
            'image_url'   => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
        ]);
    }
}