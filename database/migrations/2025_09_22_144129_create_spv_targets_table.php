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
        Schema::create('spv_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('spv_id')->constrained('users')->cascadeOnDelete();
            $table->date('period'); // gunakan awal bulan, contoh: 2025-09-01
            $table->decimal('target_amount', 20, 2)->default(0);
            $table->timestamps();

            $table->unique(['spv_id', 'period']); // satu target per SPV per bulan
            $table->index('period');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spv_targets');
    }
};
