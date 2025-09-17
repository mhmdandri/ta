<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $saledId = Auth::user()->id;
        $allTransactions = Transaction::with(['customer', 'items'])
            ->where('sales_id', $saledId)
            ->get();
        $currentMonth = Carbon::now()->month;
        $monthlyTransactions = $allTransactions->filter(function ($transaction) use ($currentMonth) {
            return Carbon::parse($transaction->created_at)->month === $currentMonth;
        });
        $summary = [
            'total_transactions' => $monthlyTransactions->count(),
            'total_customers' => $monthlyTransactions->pluck('customer.name')->filter()->unique()->count(),
            'total_net_net' => $monthlyTransactions->sum('total_net_net'),
            'total_net_price' => $monthlyTransactions->sum('total_net'),
            'total_pricelist' => $monthlyTransactions->sum('total_pricelist'),
            'total_qty' => $monthlyTransactions->sum(fn($transaction) => $transaction->items->sum('qty')),
        ];

        return Inertia::render('dashboard', [
            'summary' => $summary,
        ]);
    }
}
