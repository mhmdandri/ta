<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PricelistController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Report\Komisi\ComissionController;
use App\Http\Controllers\Report\Rekap\CorRekapController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Reports\RekapController;
use App\Http\Controllers\TransactionController;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Report\Pendapatan\RevenueController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
});

// route customer
Route::resource('customers', CustomerController::class)->middleware(['auth', 'verified']);

// route product
Route::resource('product', ProductController::class)->middleware(['auth', 'verified']);

// route transaksi
Route::resource('transactions', TransactionController::class)->middleware(['auth', 'verified']);


// route report
Route::middleware(['auth'])->prefix('report')->name('report.')->group(function () {
    Route::prefix('rekap')->name('rekap.')->group(function () {
        Route::get('/cor', [CorRekapController::class, 'index'])->name('cor.index');
        Route::get('/cor/{id}', [CorRekapController::class, 'show'])->name('cor.show');
    });
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/report/revenue', [RevenueController::class, 'index'])->name('report.revenue');
    Route::get('/report/revenue/export', [RevenueController::class, 'export'])->name('report.revenue.export');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/report/commisions', [ComissionController::class, 'index'])->name('report.commissions');
    Route::get('/report/commisions/export', [ComissionController::class, 'export'])->name('report.commissions.export');
});

//API
Route::get('/products/search', function (Request $request) {
    $q = $request->get('q', '');
    $kodeGudang = $request->get('kode_gudang', '');

    return Product::with(['priceList'])->when($q, function ($query) use ($q) {
        return $query->where(function ($subQuery) use ($q) {
            $subQuery->where('name', 'like', "%{$q}%")
                ->orWhere('code', 'like', "%{$q}%");
        });
    })
        ->when($kodeGudang, function ($query) use ($kodeGudang) {
            return $query->where('kode_gudang', $kodeGudang);
        })
        ->limit(10)
        ->get();
});
Route::get('/customer/search', function (Request $request) {
    $q = $request->get('q', '');
    return Customer::where('name', 'like', "%{$q}%")
        ->orWhere('code', 'like', "%{$q}%")
        ->limit(10)
        ->get();
})->name('customer.search');
Route::get('/users/search', function (Request $request) {
    $q = $request->get('q', '');
    return User::where('name', 'like', "%{$q}%")
        ->where('role', 'sales')
        ->limit(10)
        ->get();
});
Route::get('/pricelists/{productId}', [PricelistController::class, 'show']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
