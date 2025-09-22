<?php

namespace App\Http\Controllers\Report\Pendapatan;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RevenueController extends Controller
{
    public function index(Request $request)
    {
        // Default ke bulan ini jika tidak ada filter
        $start = $request->get('start', Carbon::now('Asia/Jakarta')->startOfMonth()->format('Y-m-d'));
        $end = $request->get('end', Carbon::now('Asia/Jakarta')->endOfMonth()->format('Y-m-d'));

        // Validasi format tanggal dan set timezone yang benar
        try {
            // Parse tanggal dan set timezone Asia/Jakarta
            $startDate = Carbon::createFromFormat('Y-m-d', $start, 'Asia/Jakarta')->startOfDay();
            $endDate = Carbon::createFromFormat('Y-m-d', $end, 'Asia/Jakarta')->endOfDay();
        } catch (\Exception $e) {
            // Jika format tanggal salah, gunakan bulan ini
            $startDate = Carbon::now('Asia/Jakarta')->startOfMonth()->startOfDay();
            $endDate = Carbon::now('Asia/Jakarta')->endOfMonth()->endOfDay();
            $start = $startDate->format('Y-m-d');
            $end = $endDate->format('Y-m-d');
        }

        // Ambil semua transaksi yang rental_start dalam periode atau overlap dengan periode
        $transactionsQuery = Transaction::with(['customer', 'sales'])
            ->where(function ($query) use ($startDate, $endDate) {
                // Cari berdasarkan rental_start jika ada
                $query->where(function ($q) use ($startDate, $endDate) {
                    $q->whereNotNull('rental_start')
                        ->where(function ($subQ) use ($startDate, $endDate) {
                            // Transaksi yang mulai dalam periode
                            $subQ->whereBetween('rental_start', [$startDate, $endDate])
                                // Atau transaksi yang end dalam periode
                                ->orWhereBetween('rental_end', [$startDate, $endDate])
                                // Atau transaksi yang mencakup seluruh periode
                                ->orWhere(function ($innerQ) use ($startDate, $endDate) {
                                    $innerQ->where('rental_start', '<=', $startDate)
                                        ->where('rental_end', '>=', $endDate);
                                });
                        });
                })
                    // Atau cari berdasarkan created_at jika rental_start null
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->whereNull('rental_start')
                            ->whereBetween('created_at', [$startDate, $endDate]);
                    });
            })
            ->orderBy('rental_start', 'desc');
        $ppnFilter = $request->string('ppn')->toString();
        if ($ppnFilter === 'ppn') {
            $transactionsQuery->where('is_ppn', true);
        } elseif ($ppnFilter === 'non') {
            $transactionsQuery->where('is_ppn', false);
        }
        $transactions = $transactionsQuery->get();

        // Process setiap transaksi berdasarkan durasi
        $rows = collect();

        foreach ($transactions as $transaction) {
            // Ambil durasi dari database, default 1 jika tidak ada
            $duration = $transaction->rental_duration ?? 1;

            // Jika durasi = 1 hari, tampilkan normal
            if ($duration == 1) {
                $rows->push([
                    'id' => $transaction->id,
                    'date' => $transaction->rental_start ? Carbon::parse($transaction->rental_start)->format('Y-m-d') : $transaction->created_at->format('Y-m-d'),
                    'no_ref' => $transaction->no_penawaran ?? ('COR-' . str_pad($transaction->id, 4, '0', STR_PAD_LEFT)),
                    'customer' => $transaction->customer->name ?? 'N/A',
                    'sales' => $transaction->sales->name ?? 'N/A',
                    'total_pricelist' => (float) $transaction->total_pricelist,
                    'total_net' => (float) $transaction->total_net,
                    'total_net_net' => (float) $transaction->total_net_net,
                    'rental_duration' => 1,
                    'ppn_value' => (float) $transaction->ppn_value,
                    'is_daily_split' => false,
                    'original_total_net' => (float) $transaction->total_net,
                    'original_total_net_net' => (float) $transaction->total_net_net,
                    'rental_period' => $transaction->rental_start && $transaction->rental_end
                        ? Carbon::parse($transaction->rental_start)->format('d/m/Y') . ' - ' . Carbon::parse($transaction->rental_end)->format('d/m/Y')
                        : null
                ]);
            }
            // Jika durasi > 1 hari, bagi per hari dan tampilkan untuk setiap hari dalam periode filter
            else {
                $rentalStart = Carbon::parse($transaction->rental_start);
                $rentalEnd = Carbon::parse($transaction->rental_end);

                // Hitung pendapatan per hari
                $dailyNet = $transaction->total_net / $duration;
                $dailyNetNet = $transaction->total_net_net / $duration;
                $dailyPpn = $transaction->ppn_value / $duration;

                // Generate entry untuk setiap hari dalam periode rental yang overlap dengan filter
                $currentDate = Carbon::parse(max($rentalStart->format('Y-m-d'), $startDate->format('Y-m-d')));
                $lastDate = Carbon::parse(min($rentalEnd->format('Y-m-d'), $endDate->format('Y-m-d')));

                while ($currentDate->lte($lastDate)) {
                    $rows->push([
                        'id' => $transaction->id . '_' . $currentDate->format('Y-m-d'),
                        'date' => $currentDate->format('Y-m-d'),
                        'no_ref' => $transaction->no_penawaran ?? ('COR-' . str_pad($transaction->id, 4, '0', STR_PAD_LEFT)),
                        'customer' => $transaction->customer->name ?? 'N/A',
                        'sales' => $transaction->sales->name ?? 'N/A',
                        'total_pricelist' => (float) $transaction->total_pricelist / $duration,
                        'total_net' => (float) $dailyNet,
                        'total_net_net' => (float) $dailyNetNet,
                        'rental_duration' => $duration,
                        'ppn_value' => (float) $dailyPpn,
                        'is_daily_split' => true,
                        'original_total_net' => (float) $transaction->total_net,
                        'original_total_net_net' => (float) $transaction->total_net_net,
                        'rental_period' => $rentalStart->format('d/m/Y') . ' - ' . $rentalEnd->format('d/m/Y')
                    ]);

                    $currentDate->addDay();
                }
            }
        }
        // Sort by date descending
        $rows = $rows->sortByDesc('date')->values();
        // Hitung summary dari data yang sudah diproses
        $summary = [
            'count' => $rows->count(),
            'total_net' => $rows->sum('total_net'),
            'total_net_net' => $rows->sum('total_net_net'),
            'avg_per_tx' => $rows->count() > 0 ? $rows->avg('total_net_net') : 0,
            'total_pricelist' => $rows->sum('total_pricelist'),
        ];

        return Inertia::render('report/pendapatan/index', [
            'rows' => $rows,
            'summary' => $summary,
            'filter' => [
                'start' => $start,
                'end' => $end,
                'ppn' => in_array($ppnFilter, ['ppn', 'non', 'all'], true) ? $ppnFilter : null,
            ]
        ]);
    }
    public function export(Request $request)
    {
        $start = $request->get('start', Carbon::now('Asia/Jakarta')->startOfMonth()->format('Y-m-d'));
        $end = $request->get('end', Carbon::now('Asia/Jakarta')->endOfMonth()->format('Y-m-d'));

        try {
            $startDate = Carbon::createFromFormat('Y-m-d', $start, 'Asia/Jakarta')->startOfDay();
            $endDate = Carbon::createFromFormat('Y-m-d', $end, 'Asia/Jakarta')->endOfDay();
        } catch (\Exception $e) {
            $startDate = Carbon::now('Asia/Jakarta')->startOfMonth()->startOfDay();
            $endDate = Carbon::now('Asia/Jakarta')->endOfMonth()->endOfDay();
        }

        // Sama dengan logic di index
        $transactionsQuery = Transaction::with(['customer', 'sales'])
            ->where(function ($query) use ($startDate, $endDate) {
                // Cari berdasarkan rental_start jika ada
                $query->where(function ($q) use ($startDate, $endDate) {
                    $q->whereNotNull('rental_start')
                        ->where(function ($subQ) use ($startDate, $endDate) {
                            $subQ->whereBetween('rental_start', [$startDate, $endDate])
                                ->orWhereBetween('rental_end', [$startDate, $endDate])
                                ->orWhere(function ($innerQ) use ($startDate, $endDate) {
                                    $innerQ->where('rental_start', '<=', $startDate)
                                        ->where('rental_end', '>=', $endDate);
                                });
                        });
                })
                    // Atau cari berdasarkan created_at jika rental_start null
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->whereNull('rental_start')
                            ->whereBetween('created_at', [$startDate, $endDate]);
                    });
            })
            ->orderBy('rental_start', 'desc');
        $ppnFilter = $request->string('ppn')->toString();
        if ($ppnFilter === 'ppn') {
            $transactionsQuery->where('is_ppn', true);
        } elseif ($ppnFilter === 'non') {
            $transactionsQuery->where('is_ppn', false);
        }
        $transactions = $transactionsQuery->get();

        // Process data sama seperti di index
        $rows = collect();

        foreach ($transactions as $transaction) {
            $duration = $transaction->rental_duration ?? 1;

            if ($duration == 1) {
                $rows->push([
                    'date' => $transaction->rental_start ? Carbon::parse($transaction->rental_start)->format('d/m/Y') : $transaction->created_at->format('d/m/Y'),
                    'no_ref' => $transaction->no_penawaran ?? ('COR-' . str_pad($transaction->id, 4, '0', STR_PAD_LEFT)),
                    'customer' => $transaction->customer->name ?? 'N/A',
                    'sales' => $transaction->sales->name ?? 'N/A',
                    'total_net' => $transaction->total_net,
                    'total_net_net' => $transaction->total_net_net,
                    'duration' => 1,
                    'daily_label' => '1 hari',
                    'ppn_value' => $transaction->ppn_value,
                    'original_total' => $transaction->total_net_net
                ]);
            } else {
                $rentalStart = Carbon::parse($transaction->rental_start);
                $rentalEnd = Carbon::parse($transaction->rental_end);

                $dailyNet = $transaction->total_net / $duration;
                $dailyNetNet = $transaction->total_net_net / $duration;
                $dailyPpn = $transaction->ppn_value / $duration;

                $currentDate = Carbon::parse(max($rentalStart->format('Y-m-d'), $startDate->format('Y-m-d')));
                $lastDate = Carbon::parse(min($rentalEnd->format('Y-m-d'), $endDate->format('Y-m-d')));

                while ($currentDate->lte($lastDate)) {
                    $rows->push([
                        'date' => $currentDate->format('d/m/Y'),
                        'no_ref' => $transaction->no_penawaran ?? ('COR-' . str_pad($transaction->id, 4, '0', STR_PAD_LEFT)),
                        'customer' => $transaction->customer->name ?? 'N/A',
                        'sales' => $transaction->sales->name ?? 'N/A',
                        'total_net' => $dailyNet,
                        'total_net_net' => $dailyNetNet,
                        'duration' => $duration,
                        'ppn_value' => $dailyPpn,
                        'daily_label' => '1/' . $duration . ' dari ' . $duration . ' hari',
                        'original_total' => $transaction->total_net_net
                    ]);

                    $currentDate->addDay();
                }
            }
        }

        // Sort by date
        $rows = $rows->sortByDesc(function ($item) {
            return Carbon::createFromFormat('d/m/Y', $item['date']);
        });
        $ppnSuffix = in_array($ppnFilter, ['ppn', 'non', 'all'], true) ? '-' . $ppnFilter : '';
        $filename = 'laporan-pendapatan-harian-' . $ppnSuffix . '-' . $start . '-to-' . $end . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($rows) {
            $file = fopen('php://output', 'w');

            // Header CSV
            fputcsv($file, [
                'Tanggal',
                'No. Ref',
                'Customer',
                'Sales',
                'Harian Net',
                'Harian Net-Net',
                'Durasi',
                'Keterangan',
                'Total Asli'
            ]);

            // Data rows
            foreach ($rows as $row) {
                fputcsv($file, [
                    $row['date'],
                    $row['no_ref'],
                    $row['customer'],
                    $row['sales'],
                    number_format($row['total_net'], 0, ',', '.'),
                    number_format($row['total_net_net'], 0, ',', '.'),
                    $row['duration'] . ' hari',
                    $row['daily_label'],
                    number_format($row['original_total'], 0, ',', '.')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
