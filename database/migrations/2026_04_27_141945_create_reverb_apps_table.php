<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reverb_apps', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('app_id')->unique();
            $table->string('name')->nullable();
            $table->string('key')->unique();
            $table->string('secret');
            $table->json('allowed_origins')->nullable();
            $table->unsignedInteger('ping_interval')->default(60);
            $table->unsignedInteger('activity_timeout')->default(30);
            $table->unsignedInteger('max_connections')->nullable();
            $table->unsignedInteger('max_message_size')->default(10000);
            $table->string('accept_client_events_from')->default('members');
            $table->boolean('rate_limit_enabled')->default(false);
            $table->unsignedInteger('rate_limit_max_attempts')->default(60);
            $table->unsignedInteger('rate_limit_decay_seconds')->default(60);
            $table->boolean('rate_limit_terminate_on_limit')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reverb_apps');
    }
};
