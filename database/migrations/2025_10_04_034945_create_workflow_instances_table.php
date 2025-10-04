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
        Schema::create('workflow_instances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('workflow_templates');
            $table->string('title');
            $table->json('form_data')->nullable();
            $table->enum('status', ['running', 'completed', 'cancelled', 'suspended'])->default('running');
            $table->json('active_steps')->nullable();
            $table->boolean('parallel_mode')->default(false);
            $table->foreignId('started_by')->constrained('users');
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflow_instances');
    }
};
