<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->json('agenda')->nullable()->after('description');
            $table->string('ad_image')->nullable()->after('image_url');
            $table->string('poster_file')->nullable()->after('ad_image');
            $table->string('publish_status')->default('published')->after('status'); // draft, published, scheduled
            $table->timestamp('scheduled_publish_at')->nullable()->after('publish_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['agenda', 'ad_image', 'poster_file', 'publish_status', 'scheduled_publish_at']);
        });
    }
};
