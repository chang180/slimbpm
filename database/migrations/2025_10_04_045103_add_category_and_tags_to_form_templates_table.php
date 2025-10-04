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
        Schema::table('form_templates', function (Blueprint $table) {
            $table->string('category')->nullable()->after('description');
            $table->json('tags')->nullable()->after('category');
            $table->boolean('is_public')->default(false)->after('tags');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_templates', function (Blueprint $table) {
            $table->dropColumn(['category', 'tags', 'is_public']);
        });
    }
};