<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getTopRental($from, $to, $user)
    {
        $quety = DB::table("transaction_items as ti")->join("transactions as t", "ti.transaction_id", "=", "t.id")
            ->join("products as p", "ti.product_id", "=", "p.id")
            ->select("p.id", "p.name", DB::raw('SUM(CAST(ti.qty AS DECIMAL(10,2))) as total_qty'))
            ->where("t.transaction_type", "rental")
            ->whereBetween("t.rental_start", [$from, $to]);
        if ($user->role === "sales") {
            $quety->where("t.sales_id", $user->id);
        }
        return $quety->groupBy("p.id", "p.name")->orderByDesc("total_qty")->limit(10)->get();
    }
    public function index()
    {
        $user = Auth::user();
        $salesId = $user->id;

        // Bulan berjalan (Asia/Jakarta)
        $tz   = 'Asia/Jakarta';
        $from = Carbon::now($tz)->startOfMonth()->toDateString();
        $to   = Carbon::now($tz)->endOfMonth()->toDateString();

        $dateField = Schema::hasColumn('transactions', 'rental_start') ? 'rental_start' : 'created_at';
        $dataChart = 'total_net_net';


        // Base query bulan berjalan
        $base = Transaction::query()
            ->whereBetween($dateField, [$from, $to]);

        // Query milik sales ini & global
        $mineQuery   = (clone $base)->where('sales_id', $salesId);
        $globalQuery = (clone $base);

        // Helper ringkas untuk aggregasi
        $summarize = function ($q) use ($from, $to) {
            // Aggregate di tabel transactions
            $row = (clone $q)->selectRaw('
                COUNT(*) as total_transactions,
                COALESCE(SUM(total_net_net), 0) as total_net_net,
                COALESCE(SUM(total_net), 0) as total_net_price,
                COALESCE(SUM(total_pricelist), 0) as total_pricelist
            ')
                ->first();

            // Distinct customers via customer_id (lebih tepat daripada nama)
            $totalCustomers = (clone $q)->distinct('customer_id')->count('customer_id');

            // Sum qty dari transaction_items untuk transaksi yang terlibat
            $ids = (clone $q)->pluck('id'); // aman & sederhana
            $totalQty = 0;
            if ($ids->isNotEmpty()) {
                $totalQty = DB::table('transaction_items')
                    ->whereIn('transaction_id', $ids)
                    ->sum('qty');
            }

            return [
                'total_transactions' => (int) ($row->total_transactions ?? 0),
                'total_customers'    => (int) $totalCustomers,
                'total_net_net'      => (float) ($row->total_net_net ?? 0),
                'total_net_price'    => (float) ($row->total_net_price ?? 0),
                'total_pricelist'    => (float) ($row->total_pricelist ?? 0),
                'total_qty'          => (int) $totalQty,
                // Info periode (opsional buat UI)
                'period'             => [
                    'start' => $from,
                    'end'   => $to,
                ],
            ];
        };

        $mySummary     = $summarize($mineQuery);
        $globalSummary = $summarize($globalQuery);

        // Tetap kompatibel dengan UI sekarang:
        // - sales: summary = milik dia
        // - non-sales: summary = global

        $weekExpr = "CEIL(DAY($dateField)/7)";

        $rows = (clone $base)
            ->selectRaw("$weekExpr as week_index")
            ->selectRaw("SUM($dataChart) as global_total")
            ->selectRaw("SUM(CASE WHEN sales_id = ? THEN $dataChart ELSE 0 END) as my_total", [$salesId])
            ->groupBy('week_index')
            ->orderBy('week_index')
            ->get()
            ->map(fn($r) => [
                'week'   => (int) $r->week_index,
                'global' => (float) $r->global_total,
                'mine'   => (float) $r->my_total,
            ])
            ->keyBy('week');

        $weeklyChart = [];
        $topProducts = $this->getTopRental($from, $to, $user);
        for ($i = 1; $i <= 5; $i++) {
            $weeklyChart[] = [
                'week'      => $i,
                'weekLabel' => 'W' . $i,
                'global'    => (float) ($rows[$i]['global'] ?? 0),
                'mine'      => (float) ($rows[$i]['mine'] ?? 0),
            ];
        }
        if ($user->role === 'sales') {
            return Inertia::render('dashboard', [
                'summary'        => $mySummary,     // seperti semula
                'globalSummary'  => $globalSummary, // bisa dipakai kalau butuh bandingkan
                'weeklyChart'    => $weeklyChart,   // data chart mingguan
                'weeklyMeta'     => [
                    'from' => $from,
                    'to'   => $to,
                    'dateField' => $dateField,
                    'dataChart' => $dataChart,
                ],
                'topProducts'  => $topProducts,
                'role'           => $user->role,
            ]);
        }
        // admin/manager/spv/dll
        return Inertia::render('dashboard', [
            'summary'    => $globalSummary, // default tampil global
            'mySummary'  => $mySummary,     // opsional: bandingkan performa user sendiri
            'weeklyChart'  => $weeklyChart,
            'weeklyMeta'   => [
                'from'      => $from,
                'to'        => $to,
                'dateField' => $dateField,
                'dataChart'    => $dataChart,
            ],
            'topProducts'  => $topProducts,
            'role'       => $user->role,
        ]);
    }
}
