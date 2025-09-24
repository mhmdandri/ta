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
        // 1) Ambil filter tanggal + period bulanan (untuk target history)
        $tz        = 'Asia/Jakarta';
        $startDate = $request->get('start', Carbon::now($tz)->startOfMonth()->toDateString());
        $endDate   = $request->get('end',   Carbon::now($tz)->endOfMonth()->toDateString());
        $period    = Carbon::parse($startDate, $tz)->startOfMonth()->toDateString();

        // 2) Ambil daftar "penjual" = sales ATAU spv yang boleh jualan
        $sales = User::query()
            ->where(function ($q) {
                $q->where('role', 'sales')
                    ->orWhere(function ($qq) {
                        $qq->where('role', 'spv')->where('is_sales_enabled', true);
                    });
            })
            // Supaya bisa resolve SPV & Manager dengan benar untuk dua kasus:
            // - Sales biasa: manager melalui supervisor->manager
            // - SPV selling : manager langsung dari user->manager
            ->with([
                'supervisor:id,name,manager_id',
                'supervisor.manager:id,name',
                'manager:id,name',
            ])

            // ======== METRIK TRANSAKSI (punyamu — tidak diubah) ========
            ->withCount([
                'transactions as total_transactions' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('rental_start', [$startDate, $endDate]);
                },
            ])
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
            ->get(['id', 'name', 'role', 'target_sales', 'supervisor_id', 'manager_id'])

            // 3) Map: hitung rateKomisi persis seperti punyamu + tentukan spv_group & manager benar
            ->map(function ($u) {
                $target     = (float)($u->target_sales ?? 0);
                $achieved   = (float)($u->sum_total_net_net ?? 0);
                $pricelist  = (float)($u->sum_total_pricelist ?? 0);
                $ppnValue   = (float)($u->ppn_value ?? 0);

                $avgDisc = $pricelist > 0 ? (($pricelist - $achieved) / $pricelist) * 100 : 0;
                $persenTarget = $target > 0 ? ($achieved / $target * 100) : 0;

                // === LOGIKA KOMISI PERSIS DARI KODEMU ===
                $rateKomisi = 0;
                if ($persenTarget <= 75 && $target == 300000000) {
                    $rateKomisi = $avgDisc <= 20 ? 5 : ($avgDisc <= 25 ? 4 : ($avgDisc <= 30 ? 3 : 2));
                } else if ($persenTarget <= 100 && $target == 300000000) {
                    $rateKomisi = $avgDisc <= 20 ? 6 : ($avgDisc <= 25 ? 5 : ($avgDisc <= 30 ? 4 : 3));
                } else if ($persenTarget > 100 && $target == 300000000) {
                    $rateKomisi = $avgDisc <= 20 ? 7 : ($avgDisc <= 25 ? 6 : ($avgDisc <= 30 ? 5 : 4));
                }
                if ($persenTarget <= 75 && $target == 200000000) {
                    $rateKomisi = $avgDisc <= 20 ? 2.5 : ($avgDisc <= 25 ? 2 : ($avgDisc <= 30 ? 1.5 : 1));
                } else if ($persenTarget <= 100 && $target == 200000000) {
                    $rateKomisi = $avgDisc <= 20 ? 3 : ($avgDisc <= 25 ? 2.5 : ($avgDisc <= 30 ? 2 : 1.5));
                } else if ($persenTarget > 100 && $target == 200000000) {
                    $rateKomisi = $avgDisc <= 20 ? 3.5 : ($avgDisc <= 25 ? 3 : ($avgDisc <= 30 ? 2.5 : 2));
                }

                // === Tentukan SPV group & Manager yang benar ===
                $isSpvSeller = ($u->role === 'spv');
                $spvGroupId   = $isSpvSeller ? $u->id : $u->supervisor_id;
                $spvGroupName = $isSpvSeller ? $u->name : optional($u->supervisor)->name;

                $managerId   = $isSpvSeller ? $u->manager_id : optional($u->supervisor)->manager_id;
                $managerName = $isSpvSeller ? optional($u->manager)->name : optional(optional($u->supervisor)->manager)->name;

                return [
                    'id'                   => $u->id,
                    'role'                 => $u->role,
                    'name'                 => $u->name,

                    'spv_id'               => $u->supervisor_id,   // supervisor asli (jika sales)
                    'spv_name'             => optional($u->supervisor)->name,
                    'spv_group_id'         => $spvGroupId,         // dipakai untuk agregasi By SPV
                    'spv_group_name'       => $spvGroupName,

                    'manager_id'           => $managerId,
                    'manager_name'         => $managerName,

                    'target_sales'         => $target,
                    'sum_total_pricelist'  => (float)($u->sum_total_pricelist ?? 0),
                    'sum_total_net'        => (float)($u->sum_total_net ?? 0),
                    'sum_total_net_net'    => $achieved,
                    'sum_total_final'      => (float)($u->sum_total_final ?? 0),
                    'total_transactions'   => (int)($u->total_transactions ?? 0),
                    'rental_count'         => (int)($u->rental_count ?? 0),
                    'sale_count'           => (int)($u->sale_count ?? 0),
                    'ppn_value'            => $ppnValue,
                    'operate_fee'          => (float)($u->operate_fee ?? 0),
                    'jasa_kirim'           => (float)($u->jasa_kirim ?? 0),
                    'jasa_sticker'         => (float)($u->jasa_sticker ?? 0),
                    'extra_discount'       => (float)($u->extra_discount ?? 0),

                    'persenTarget'         => $persenTarget,
                    'avgDisc'              => $avgDisc,
                    'rateKomisi'           => $rateKomisi,
                ];
            });

        // 4) Split gudang: tambahkan SPV seller juga (bukan hanya sales)
        $byGudang = DB::table('users')
            ->join('transactions', function ($join) use ($startDate, $endDate) {
                $join->on('transactions.sales_id', '=', 'users.id')
                    ->whereBetween('transactions.rental_start', [$startDate, $endDate]);
            })
            ->join('transaction_items', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->join('products', 'products.id', '=', 'transaction_items.product_id')
            ->where(function ($q) {
                $q->where('users.role', 'sales')
                    ->orWhere(function ($qq) {
                        $qq->where('users.role', 'spv')->where('users.is_sales_enabled', true);
                    });
            })
            ->groupBy('users.id')
            ->select([
                'users.id as sales_id',
                DB::raw('COALESCE(SUM(transaction_items.net_net), 0) as sum_net_net_all_items'),
                DB::raw("COALESCE(SUM(CASE WHEN products.kode_gudang = '04' THEN transaction_items.net_net ELSE 0 END), 0) as sum_net_net_gdg_os"),
                DB::raw("COALESCE(SUM(CASE WHEN products.kode_gudang = '02' THEN transaction_items.net_net ELSE 0 END), 0) as sum_net_net_gdg_cabang"),
            ])
            ->get()
            ->keyBy('sales_id');

        // 5) Merge hasil split gudang ke $sales
        $sales = $sales->map(function (array $row) use ($byGudang) {
            $g = $byGudang->get($row['id']);

            $sumAllItems     = (float)($g->sum_net_net_all_items ?? 0);
            $totalOS         = (float)($g->sum_net_net_gdg_os ?? 0);
            $totalCabang     = (float)($g->sum_net_net_gdg_cabang ?? 0);
            $sumTotalNetNet  = (float)$row['sum_total_net_net'];
            $netNetWithoutOS = $sumTotalNetNet - $totalOS;


            return array_merge($row, [
                'sum_net_net_items_all'    => $sumAllItems,
                'sum_total_net_net_os'     => $totalOS,
                'sum_total_net_net_cabang' => $totalCabang,
                'netNetWithoutOS'          => $netNetWithoutOS,
            ]);
        });
        $salesOnly = $sales->filter(fn($r) => ($r['role'] ?? null) === 'sales')->values();

        // 6) Target history: ambil target SPV & Manager untuk $period
        $spvIds = $sales->pluck('spv_group_id')->filter()->unique()->values();
        $managerIds = $sales->pluck('manager_id')->filter()->unique()->values();

        $spvTargets = DB::table('spv_targets')
            ->whereIn('spv_id', $spvIds)
            ->where('period', $period)
            ->pluck('target_amount', 'spv_id');          // [spv_id => target_amount]

        $managerTargets = DB::table('manager_targets')
            ->whereIn('manager_id', $managerIds)
            ->where('period', $period)
            ->pluck('target_amount', 'manager_id');      // [manager_id => target_amount]

        // 7) Agregasi BY SPV (gunakan spv_group_id agar SPV selling ikut timnya sendiri)
        $spv = $sales
            ->filter(fn($r) => !empty($r['spv_group_id']))
            ->groupBy('spv_group_id')
            ->map(function (Collection $rows, $spvId) use ($spvTargets) {
                $spvName       = $rows->first()['spv_group_name'] ?? 'SPV';

                $sumPricelist  = $rows->sum('sum_total_pricelist');
                $sumNet        = $rows->sum('sum_total_net');
                $sumNetNet     = $rows->sum('sum_total_net_net');
                $sumFinal      = $rows->sum('sum_total_final');
                $totalTx       = $rows->sum('total_transactions');
                $rentalCount   = $rows->sum('rental_count');
                $saleCount     = $rows->sum('sale_count');
                $ppnValue      = $rows->sum('ppn_value');
                $operateFee    = $rows->sum('operate_fee');
                $jasaKirim     = $rows->sum('jasa_kirim');
                $jasaSticker   = $rows->sum('jasa_sticker');
                $extraDiscount = $rows->sum('extra_discount');

                $sumOS         = $rows->sum('sum_total_net_net_os') ?? 0;
                $sumCabang     = $rows->sum('sum_total_net_net_cabang') ?? 0;
                $sumNonOS      = $rows->sum('netNetWithoutOS') ?? 0;

                $avgDisc = $sumPricelist > 0 ? (($sumPricelist - $sumNetNet) / $sumPricelist) * 100 : 0;

                $targetSpv    = (float)($spvTargets[$spvId] ?? 0);
                $persenTarget = $targetSpv > 0 ? ($sumNetNet / $targetSpv * 100) : 0;

                // (opsional) rate komisi SPV tim — isi jika ada aturan khusus SPV
                $rateKomisiSpv = 0;
                if ($persenTarget <= 75) {
                    //$rateKomisi = $avgDisc <= 20 ? 5 : ($avgDisc <= 25 ? 4 : ($avgDisc <= 30 ? 3 : 2));
                    $rateKomisiSpv = $avgDisc <= 20 ? 2.5 : ($avgDisc <= 25 ? 2 : ($avgDisc <= 30 ? 1.5 : 1));
                } else if ($persenTarget <= 100) {
                    $rateKomisiSpv = $avgDisc <= 20 ? 3 : ($avgDisc <= 25 ? 2.5 : ($avgDisc <= 30 ? 2 : 1.5));
                } else if ($persenTarget > 100) {
                    $rateKomisiSpv = $avgDisc <= 20 ? 3.5 : ($avgDisc <= 25 ? 3 : ($avgDisc <= 30 ? 2.5 : 2));
                }

                return [
                    'id'                   => (int)$spvId,
                    'name'                 => $spvName,
                    'members'                  => $rows->count(),
                    'target_spv'               => $targetSpv,
                    'sum_total_pricelist'      => $sumPricelist,
                    'sum_total_net'            => $sumNet,
                    'sum_total_net_net'        => $sumNetNet,
                    'sum_total_final'          => $sumFinal,
                    'total_transactions'       => $totalTx,
                    'rental_count'             => $rentalCount,
                    'sale_count'               => $saleCount,
                    'ppn_value'                => $ppnValue,
                    'operate_fee'              => $operateFee,
                    'jasa_kirim'               => $jasaKirim,
                    'jasa_sticker'             => $jasaSticker,
                    'extra_discount'           => $extraDiscount,
                    'sum_total_net_net_os'     => $sumOS,
                    'sum_total_net_net_cabang' => $sumCabang,
                    'netNetWithoutOS'          => $sumNonOS,
                    'avgDisc'                  => $avgDisc,
                    'persenTarget'             => $persenTarget,
                    'rateKomisiSpv'            => $rateKomisiSpv,
                ];
            })
            ->values();

        // 8) Agregasi BY MANAGER
        $manager = $sales
            ->filter(fn($r) => !empty($r['manager_id']))
            ->groupBy('manager_id')
            ->map(function (Collection $rows, $managerId) use ($managerTargets) {
                $managerName   = $rows->first()['manager_name'] ?? 'Manager';

                $sumPricelist  = $rows->sum('sum_total_pricelist');
                $sumNet        = $rows->sum('sum_total_net');
                $sumNetNet     = $rows->sum('sum_total_net_net');
                $sumFinal      = $rows->sum('sum_total_final');
                $totalTx       = $rows->sum('total_transactions');
                $rentalCount   = $rows->sum('rental_count');
                $saleCount     = $rows->sum('sale_count');
                $ppnValue      = $rows->sum('ppn_value');
                $operateFee    = $rows->sum('operate_fee');
                $jasaKirim     = $rows->sum('jasa_kirim');
                $jasaSticker   = $rows->sum('jasa_sticker');
                $extraDiscount = $rows->sum('extra_discount');

                $sumOS         = $rows->sum('sum_total_net_net_os') ?? 0;
                $sumCabang     = $rows->sum('sum_total_net_net_cabang') ?? 0;
                $sumNonOS      = $rows->sum('netNetWithoutOS') ?? 0;

                $avgDisc = $sumPricelist > 0 ? (($sumPricelist - $sumNetNet) / $sumPricelist) * 100 : 0;

                $targetMgr    = (float)($managerTargets[$managerId] ?? 0);
                $persenTarget = $targetMgr > 0 ? ($sumNetNet / $targetMgr * 100) : 0;

                // (opsional) rate komisi manager — isi jika ada aturan khusus manager
                $rateKomisiManager = 0;
                if ($persenTarget <= 75) {
                    $rateKomisiManager = $avgDisc <= 20 ? 1.75 : ($avgDisc <= 25 ? 1.4 : ($avgDisc <= 30 ? 1 : 0.7));
                } else if ($persenTarget <= 100) {
                    $rateKomisiManager = $avgDisc <= 20 ? 2 : ($avgDisc <= 25 ? 1.75 : ($avgDisc <= 30 ? 1.4 : 1));
                } else if ($persenTarget > 100) {
                    $rateKomisiManager = $avgDisc <= 20 ? 2.45 : ($avgDisc <= 25 ? 2 : ($avgDisc <= 30 ? 1.75 : 1.4));
                }
                $spvCount   = $rows->pluck('spv_group_id')->filter()->unique()->count();
                $memberCount = $rows->count();

                return [
                    'id'               => (int)$managerId,
                    'name'             => $managerName,
                    'spv_count'                => $spvCount,
                    'members'                  => $memberCount,
                    'target_manager'           => $targetMgr,
                    'sum_total_pricelist'      => $sumPricelist,
                    'sum_total_net'            => $sumNet,
                    'sum_total_net_net'        => $sumNetNet,
                    'sum_total_final'          => $sumFinal,
                    'total_transactions'       => $totalTx,
                    'rental_count'             => $rentalCount,
                    'sale_count'               => $saleCount,
                    'ppn_value'                => $ppnValue,
                    'operate_fee'              => $operateFee,
                    'jasa_kirim'               => $jasaKirim,
                    'jasa_sticker'             => $jasaSticker,
                    'extra_discount'           => $extraDiscount,
                    'sum_total_net_net_os'     => $sumOS,
                    'sum_total_net_net_cabang' => $sumCabang,
                    'netNetWithoutOS'          => $sumNonOS,
                    'avgDisc'                  => $avgDisc,
                    'persenTarget'             => $persenTarget,
                    'rateKomisiManager'        => $rateKomisiManager,
                ];
            })
            ->values();
        $totalTarget = $manager->sum('target_manager');
        $totalPencapaian = $manager->sum('sum_total_net_net');
        $totalPersen = $totalTarget > 0 ? ($totalPencapaian / $totalTarget * 100) : 0;
        // 9) Render Inertia
        return Inertia::render('report/komisi/index', [
            'sales'   => $salesOnly,
            'spv'     => $spv,
            'manager' => $manager,
            'total_target' => $totalTarget,
            'total_pencapaian' => $totalPencapaian,
            'total_persen' => $totalPersen,
            'filters' => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
                'period'     => $period,
            ],
        ]);
    }
}
