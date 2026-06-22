<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reverb_apps', function (Blueprint $table): void {
            $table->foreignUlid('user_id')
                ->nullable()
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();
        });

        // Backfill any pre-ownership apps onto the first user. No-op on a
        // fresh database (e.g. the test suite), which has no users yet.
        $ownerId = User::query()->oldest()->value('id');

        if ($ownerId !== null) {
            DB::table('reverb_apps')
                ->whereNull('user_id')
                ->update(['user_id' => $ownerId]);
        }
    }

    public function down(): void
    {
        Schema::table('reverb_apps', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('user_id');
        });
    }
};
