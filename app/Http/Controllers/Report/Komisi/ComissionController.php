<?php

namespace App\Http\Controllers\Report\Komisi;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ComissionController extends Controller
{
    public function index()
    {
        $startDate = Carbon::now('Asia/Jakarta')->startOfMonth();
        $endDate   = Carbon::now('Asia/Jakarta')->endOfMonth();
        $gudangOS = "04";
        $sales = User::query()
            ->where('role', 'sales')
            // total transaksi
            ->withCount([
                'transactions as total_transactions' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate]);
                },
            ])
            // breakdown rental / sale
            ->withCount([
                'transactions as rental_count' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate])
                        ->where('transaction_type', 'rental');
                },
                'transactions as sale_count' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate])
                        ->where('transaction_type', 'sale');
                },
            ])
            // sum kolom uang
            ->withSum([
                'transactions as sum_total_pricelist' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate]);
                }
            ], 'total_pricelist')
            ->withSum([
                'transactions as sum_total_net' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate]);
                }
            ], 'total_net')
            ->withSum([
                'transactions as sum_total_net_net' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate]);
                }
            ], 'total_net_net')
            ->withSum([
                'transactions as sum_total_final' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate]);
                }
            ], 'total_final')
            ->withSum([
                'transactions as ppn_value' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate])
                        ->where('is_ppn', true);
                }
            ], 'ppn_value')
            ->withSum([
                'transactions as operate_fee' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate]);
                }
            ], 'operate_fee')
            ->withSum([
                'transactions as jasa_kirim' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate]);
                }
            ], 'jasa_kirim')
            ->withSum([
                'transactions as jasa_sticker' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate]);
                }
            ], 'jasa_sticker')
            ->withSum([
                'transactions as extra_discount' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate]);
                }
            ], 'extra_discount')
            ->orderByDesc('sum_total_net_net')
            ->get(['id', 'name', 'target_sales'])   // ← ambil target dari users
            ->map(function ($u) {
                $target   = (float)($u->target_sales ?? 0);
                $achieved = (float)($u->sum_total_net_net ?? 0);
                $pricelist = (float)($u->sum_total_pricelist ?? 0);
                $ppnValue = (float)($u->ppn_value ?? 0);
                $avgDisc = 0;
                if ($pricelist > 0) {
                    $diskon = $pricelist - $achieved;
                    $avgDisc = $diskon / $pricelist * 100;
                }
                $persenTarget = $achieved / $target * 100;
                // kembalikan object dengan field tambahan (tetap bawa field lama)
                return [
                    'id'                   => $u->id,
                    'name'                 => $u->name,
                    'target_sales'         => $target,
                    'sum_total_pricelist'  => (float)($u->sum_total_pricelist ?? 0),
                    'sum_total_net'        => (float)($u->sum_total_net ?? 0),
                    'sum_total_net_net'    => $achieved,
                    'sum_total_final'      => (float)($u->sum_total_final ?? 0),
                    'total_transactions'   => (int)($u->total_transactions ?? 0),
                    'rental_count'         => (int)($u->rental_count ?? 0),
                    'ppn_value'            => $ppnValue,
                    'operate_fee'          => (float)($u->operate_fee ?? 0),
                    'jasa_kirim'          => (float)($u->jasa_kirim ?? 0),
                    'jasa_sticker'          => (float)($u->jasa_sticker ?? 0),
                    'extra_discount'      => (float)($u->extra_discount ?? 0),
                    'sale_count'           => (int)($u->sale_count ?? 0),
                    'persenTarget'         => $persenTarget,
                    'avgDisc'              => $avgDisc,
                ];
            });
        $byGudang = DB::table('users')
            ->join('transactions', function ($join) use ($startDate, $endDate) {
                $join->on('transactions.sales_id', '=', 'users.id')
                    ->whereBetween('transactions.rental_start', [$startDate, $endDate]);
            })
            ->join('transaction_items', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->join('products', 'products.id', '=', 'transaction_items.product_id')
            ->where('users.role', 'sales')
            // ->where('products.kode_gudang', $gudangOS)
            ->groupBy('users.id')
            ->select([
                'users.id as sales_id',
                // total semua item (semua gudang)
                DB::raw('COALESCE(SUM(transaction_items.net_net), 0) as sum_net_net_all_items'),
                // total per gudang (pivot)
                DB::raw("COALESCE(SUM(CASE WHEN products.kode_gudang = '04' THEN transaction_items.net_net ELSE 0 END), 0) as sum_net_net_gdg_os"),
                DB::raw("COALESCE(SUM(CASE WHEN products.kode_gudang = '02' THEN transaction_items.net_net ELSE 0 END), 0) as sum_net_net_gdg_cabang"),
                // kalau perlu gudang lain, tinggal tambah baris CASE WHEN
                // DB::raw("COALESCE(SUM(CASE WHEN products.kode_gudang = '01' THEN transaction_items.net_net ELSE 0 END), 0) as sum_net_net_gdg_01"),

            ])
            ->get()
            ->keyBy('sales_id');

        // 3) Merge: tambahkan total khusus gudang 04 dan sisanya (non-04)
        $sales = $sales->map(function (array $row) use ($byGudang) {
            $g = $byGudang->get($row['id']);

            $sumAllItems = (float)($g->sum_net_net_all_items ?? 0); // total dari items (semua gudang)
            $totalOS       = (float)($g->sum_net_net_gdg_os ?? 0);
            $totalCabang       = (float)($g->sum_net_net_gdg_cabang ?? 0);
            $sumTotalNetNet   = (float)$row['sum_total_net_net'];
            $netNetWithoutOS = $sumTotalNetNet - $totalOS;
            return array_merge($row, [
                // dari items (lebih akurat untuk split gudang):
                'sum_net_net_items_all' => $sumAllItems,

                // khusus gudang:
                'sum_total_net_net_os'    => $totalOS,
                'sum_total_net_net_cabang'    => $totalCabang,
                'netNetWithoutOS'      => $netNetWithoutOS,
            ]);
        });
        // $sales = $sales->map(function (array $row) use ($byGudang) {
        //     $sumAll    = (float)$row['sum_total_net_net'];
        //     $sumGudang = (float)($byGudang->get($row['id'])->sum_total_net_net_os ?? 0);
        //     $sumNon    = max(0, $sumAll - $sumGudang);

        //     // (opsional) persen per gudang terhadap target
        //     $target    = (float)$row['target_sales'];
        //     $pctGdg    = $target > 0 ? round(($sumGudang / $target) * 100, 2) : 0;
        //     $netNetWithoutOS = $sumAll - $sumGudang;

        //     return array_merge($row, [
        //         'sum_total_net_net_os'   => $sumGudang, // hanya gudang 04
        //         'netNetWithoutOS'      => $netNetWithoutOS,
        //         'sum_total_net_net_non_gudang'  => $sumNon,    // total selain gudang 04
        //         'persenTarget_gudang_04'        => $pctGdg,
        //     ]);
        // });

        return Inertia::render('report/komisi/index', [
            'sales' => $sales,
            'filters' => [
                'start_date' => $startDate->toDateString(),
                'end_date'   => $endDate->toDateString(),
            ],
        ]);
    }
}
