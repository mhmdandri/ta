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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('sales_id')->constrained('users')->onDelete('cascade');
            $table->string('no_penawaran')->unique();
            $table->string('no_po')->nullable();
            $table->enum('termin_of_payment', ['cod', '7hari', '15hari', '30hari'])->default('cod');
            $table->enum('payment', ['cash', 'transfer'])->default('cash');
            $table->decimal('operate_fee', 15, 2)->default(0);
            $table->decimal('jasa_kirim', 15, 2)->default(0);
            $table->decimal('jasa_sticker', 15, 2)->default(0);
            $table->decimal('total_pricelist', 15, 2)->default(0);
            $table->decimal('price_deal', 15, 2)->default(0);
            $table->decimal('total_discount', 15, 2)->default(0);
            $table->decimal('total_net', 15, 2)->default(0);
            $table->decimal('extra_discount', 15, 2)->default(0);
            $table->decimal('total_net_net', 15, 2)->default(0);
            $table->boolean('is_ppn')->default(false);
            $table->decimal('ppn_value', 15, 2)->default(0);
            $table->decimal('total_final', 15, 2)->default(0);
            $table->enum('transaction_type', ['rental', 'sale'])->default('rental');
            $table->dateTime('rental_start')->nullable();
            $table->dateTime('rental_end')->nullable();
            $table->dateTime('install_date')->nullable();
            $table->dateTime('uninstall_date')->nullable();
            $table->enum('jenis_instalasi', ['indoor', 'outdoor'])->nullable();
            $table->string('location')->nullable();
            $table->enum('delivery', ['internal', 'vendor'])->default('internal');
            $table->text('description')->nullable();
            $table->string('pic')->nullable();
            $table->integer('rental_duration')->default(0);
            $table->enum('status', ['submitted', 'completed', 'cancelled'])->default('submitted');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
