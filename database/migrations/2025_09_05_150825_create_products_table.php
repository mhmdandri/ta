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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code');

            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['jual', 'sewa', 'jasa']);
            $table->decimal('price', 15, 2);
            $table->integer('stock')->default(0);
            $table->string('kode_gudang', 10)->default('01');
            $table->unique(['code', 'kode_gudang']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
