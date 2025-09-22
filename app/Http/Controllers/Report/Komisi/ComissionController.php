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
    public function index(Request $request)
    {
        $startDate = $request->get('start', Carbon::now('Asia/Jakarta')->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end', Carbon::now('Asia/Jakarta')->endOfMonth()->format('Y-m-d'));
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
                $persenTarget = $target > 0 ? ($achieved / $target * 100) : 0;
                $rateKomisi = 0;
                if ($persenTarget <= 75 && $target == 300000000) {
                    $avgDisc <= 20 ? $rateKomisi = 5 : ($avgDisc <= 25 ? $rateKomisi = 4 : ($avgDisc <= 30 ? $rateKomisi = 3 : $rateKomisi = 2));
                } else if ($persenTarget <= 100 && $target == 300000000) {
                    $avgDisc <= 20 ? $rateKomisi = 6 : ($avgDisc <= 25 ? $rateKomisi = 5 : ($avgDisc <= 30 ? $rateKomisi = 4 : $rateKomisi = 3));
                } else if ($persenTarget > 100 && $target == 300000000) {
                    $avgDisc <= 20 ? $rateKomisi = 7 : ($avgDisc <= 25 ? $rateKomisi = 6 : ($avgDisc <= 30 ? $rateKomisi = 5 : $rateKomisi = 4));
                }
                if ($persenTarget <= 75 && $target == 200000000) {
                    $avgDisc <= 20 ? $rateKomisi = 2.5 : ($avgDisc <= 25 ? $rateKomisi = 2 : ($avgDisc <= 30 ? $rateKomisi = 1.5 : $rateKomisi = 1));
                } else if ($persenTarget <= 100 && $target == 200000000) {
                    $avgDisc <= 20 ? $rateKomisi = 3 : ($avgDisc <= 25 ? $rateKomisi = 2.5 : ($avgDisc <= 30 ? $rateKomisi = 2 : $rateKomisi = 1.5));
                } else if ($persenTarget > 100 && $target == 200000000) {
                    $avgDisc <= 20 ? $rateKomisi = 3.5 : ($avgDisc <= 25 ? $rateKomisi = 3 : ($avgDisc <= 30 ? $rateKomisi = 2.5 : $rateKomisi = 2));
                }
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
                    'rateKomisi'           => $rateKomisi,
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
        return Inertia::render('report/komisi/index', [
            'sales' => $sales,
            'filters' => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
            ],
        ]);
    }
}
