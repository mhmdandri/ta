<?php

namespace App\Http\Controllers\Report\Pendapatan;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RevenueController extends Controller
{
    public function index(Request $req)
    {
        $mode = $req->string('mode', 'harian')->toString();
        // $salesId = auth()->id(); // filter by sales login (ubah jika admin)

        $query = Transaction::with(['customer', 'sales']);

        // Terapkan filter periode
        [$start, $end, $echo] = $this->resolveRange($mode, $req);

        $rows = $query->whereBetween('created_at', [$start, $end])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'date' => $t->created_at->toDateString(),
                'no_ref' => $t->no_penawaran ?? ('COR-' . str_pad($t->id, 4, '0', STR_PAD_LEFT)),
                'customer' => $t->customer?->name ?? 'N/A',
                'sales' => $t->sales?->name ?? 'N/A',
                'total_net' => (float)$t->total_net,
                'total_net_net' => (float)$t->total_net_net,
            ]);

        $summary = [
            'count' => $rows->count(),
            'total_net' => $rows->sum('total_net'),
            'total_net_net' => $rows->sum('total_net_net'),
            'avg_per_tx' => $rows->count() ? $rows->avg('total_net_net') : 0,
        ];

        return Inertia::render('report/pendapatan/index', [
            'rows' => $rows,
            'summary' => $summary,
            'filter' => $echo + ['mode' => $mode],
        ]);
    }

    public function export(Request $req)
    {
        [$start, $end] = $this->resolveRange($req->string('mode', 'harian'), $req);

        //$salesId = auth()->id();
        $rows = Transaction::with(['customer', 'sales'])
            // ->where('sales_id', $salesId)
            ->whereBetween('created_at', [$start, $end])
            ->orderBy('created_at', 'desc')
            ->get();

        $csv = collect([['Tanggal', 'No Ref', 'Customer', 'Sales', 'Subtotal(Net)', 'Total(Net-net)']])
            ->merge($rows->map(fn($t) => [
                $t->created_at->toDateString(),
                $t->no_penawaran ?? ('COR-' . str_pad($t->id, 4, '0', STR_PAD_LEFT)),
                $t->customer?->name ?? 'N/A',
                $t->sales?->name ?? 'N/A',
                (float)$t->total_net,
                (float)$t->total_net_net,
            ]))
            ->map(fn($row) => implode(',', array_map(fn($v) => '"' . str_replace('"', '""', $v) . '"', $row)))
            ->implode("\n");

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename=revenue.csv',
        ]);
    }

    private function resolveRange(string $mode, Request $req): array
    {
        $today = Carbon::today();

        if ($mode === 'harian') {
            $d = Carbon::parse($req->get('date', $today->toDateString()));
            // Fix: Create separate instances for start and end
            $startDate = $d->copy()->startOfDay();
            $endDate = $d->copy()->endOfDay();
            return [$startDate, $endDate, ['date' => $d->toDateString()]];
        }

        if ($mode === 'range') {
            $s = Carbon::parse($req->get('start', $today->toDateString()))->startOfDay();
            $e = Carbon::parse($req->get('end', $today->toDateString()))->endOfDay();
            return [$s, $e, ['start' => $s->toDateString(), 'end' => $e->toDateString()]];
        }

        if ($mode === 'mingguan') {
            $ws = Carbon::parse($req->get('week_start', $today->startOfWeek(Carbon::MONDAY)->toDateString()))->startOfDay();
            $we = (clone $ws)->endOfWeek(Carbon::SUNDAY)->endOfDay();
            return [$ws, $we, ['week_start' => $ws->toDateString()]];
        }

        // default & bulanan
        $month = $req->get('month', $today->format('Y-m'));
        $m = Carbon::parse($month . '-01');
        $startMonth = $m->copy()->startOfMonth();
        $endMonth = $m->copy()->endOfMonth();
        return [$startMonth, $endMonth, ['month' => $m->format('Y-m')]];
    }
}
