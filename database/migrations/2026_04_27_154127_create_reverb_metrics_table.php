<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reverb_metrics', function (Blueprint $table): void {
            $table->id();
            $table->string('reverb_app_id')->index();
            $table->dateTime('bucket_hour');
            $table->string('type', 32);
            $table->unsignedBigInteger('count')->default(0);
            $table->timestamps();

            $table->unique(['reverb_app_id', 'bucket_hour', 'type']);
            $table->index(['reverb_app_id', 'type', 'bucket_hour']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reverb_metrics');
    }
};
