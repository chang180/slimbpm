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
        Schema::table('organization_settings', function (Blueprint $table) {
            $table->string('slug')->unique()->after('id');
            $table->string('contact_person')->nullable()->after('name');
            $table->string('contact_email')->nullable()->after('contact_person');
            $table->string('industry')->nullable()->after('contact_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organization_settings', function (Blueprint $table) {
            $table->dropColumn(['slug', 'contact_person', 'contact_email', 'industry']);
        });
    }
};
