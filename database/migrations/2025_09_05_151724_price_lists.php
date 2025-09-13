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
        Schema::create('pricelists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->decimal('price_1_day', 12, 2)->nullable();
            $table->decimal('price_3_days', 12, 2)->nullable();
            $table->decimal('price_5_days', 12, 2)->nullable();
            $table->decimal('price_7_days', 12, 2)->nullable();
            $table->decimal('price_10_days', 12, 2)->nullable();
            $table->decimal('price_30_days', 12, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
