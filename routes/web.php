<?php

use App\Http\Controllers\PricelistController;
use App\Http\Controllers\ProductController;
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

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::resource('transactions', TransactionController::class)->middleware(['auth', 'verified']);
//Route::resource('reports', ReportController::class)->middleware(['auth', 'verified']);
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

Route::get('/customers/search', function (Request $request) {
    $q = $request->get('q', '');
    return Customer::where('name', 'like', "%{$q}%")
        ->orWhere('code', 'like', "%{$q}%")
        ->limit(10)
        ->get();
});
Route::get('/users/search', function (Request $request) {
    $q = $request->get('q', '');
    return User::where('name', 'like', "%{$q}%")
        ->where('role', 'sales')
        ->limit(10)
        ->get();
});
Route::get('/pricelists/{productId}', [PricelistController::class, 'show']);

Route::middleware(['auth'])->prefix('report')->name('report.')->group(function () {
    // Main page: /report
    // Route::get('/', function () {
    //     return Inertia::render('report/index'); // resources/js/Pages/report/index.tsx
    // })->name('index');

    // /report/rekap/cor
    Route::prefix('rekap')->name('rekap.')->group(function () {
        Route::get('/cor', [CorRekapController::class, 'index'])->name('cor.index');
        Route::get('/cor/{id}', [CorRekapController::class, 'show'])->name('cor.show');

        // (opsional) endpoint data untuk fetch tabel
        // Route::get('/cor/data', [CorRekapController::class, 'data'])->name('cor.data');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
