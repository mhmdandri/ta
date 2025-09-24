<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            ALTER TABLE `users`
            MODIFY `role` ENUM('sales','spv','admin','finance','manager') NOT NULL DEFAULT 'sales'
        ");
        Schema::table('users', function (Blueprint $table) {
            // hirarki
            $table->foreignId('supervisor_id')
                ->nullable()
                ->after('role')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('manager_id')
                ->nullable()
                ->after('supervisor_id')
                ->constrained('users')
                ->nullOnDelete();

            // SPV boleh jualan
            $table->boolean('is_sales_enabled')
                ->default(true)
                ->after('manager_id');

            // index bantu query
            $table->index('role');
            $table->index('supervisor_id');
            $table->index('manager_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['supervisor_id']);
            $table->dropIndex(['manager_id']);
            $table->dropConstrainedForeignId('manager_id');
            $table->dropConstrainedForeignId('supervisor_id');
            $table->dropColumn('is_sales_enabled');
        });

        // Kembalikan ENUM ke semula (SESUAIKAN dengan migrasi awal proyekmu)
        DB::statement("
            ALTER TABLE `users`
            MODIFY `role` ENUM('sales','admin','finance','manager') NOT NULL DEFAULT 'sales'
        ");
    }
};
