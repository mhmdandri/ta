<?php

namespace App\Http\Controllers\Report\Rekap;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CorRekapController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::with(['customer', 'sales', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'no_cor' => $transaction->no_penawaran ?? 'COR-' . str_pad($transaction->id, 4, '0', STR_PAD_LEFT),
                    'customer_name' => $transaction->customer?->name ?? 'N/A',
                    'sales_name' => $transaction->sales?->name ?? 'N/A',
                    'status' => $transaction->transaction_type ?? 'COR',
                    'divisi' => 'Rental', // You can add this field to transaction model
                    'total_qty' => $transaction->items->sum('qty') ?? 0,
                    'total_pricelist' => $transaction->total_pricelist ?? 0,
                    'total_net' => $transaction->total_net ?? 0,
                    'total_net_net' => $transaction->total_net_net ?? 0,
                    'ppn_value' => $transaction->ppn_value ?? 0,
                    'total_final' => $transaction->total_final ?? 0,
                    'extra_discount' => $transaction->extra_discount ?? 0,
                    'operate_fee' => $transaction->operate_fee ?? 0,
                    'rental_start' => $transaction->rental_start,
                    'rental_end' => $transaction->rental_end,
                    'install_date' => $transaction->install_date,
                    'uninstall_date' => $transaction->uninstall_date,
                    'created_at' => $transaction->created_at,
                    'items' => $transaction->items->map(function ($item) {
                        return [
                            'product_name' => $item->product?->name ?? 'N/A',
                            'product_type' => $item->product?->category ?? 'Barang KMJ',
                            'qty' => $item->qty ?? 0,
                            'unit' => $item->product?->unit ?? 'Unit',
                            'price_pricelist' => $item->price_pricelist ?? 0,
                            'price_deal' => $item->price_deal ?? 0,
                            'discount' => $item->discount ?? 0,
                            'discount_percent' => $item->discount_percent ?? 0,
                            'net_net' => $item->net_net ?? 0,
                        ];
                    })
                ];
            });

        // Summary data
        $summary = [
            'total_transactions' => $transactions->count(),
            'total_customers' => $transactions->pluck('customer_name')->unique()->filter(function ($name) {
                return $name !== 'N/A';
            })->count(),
            'total_value' => $transactions->sum('total_net_net'),
            'total_qty' => $transactions->sum('total_qty'),
        ];

        return Inertia::render('report/rekap/cor/index', [
            'transactions' => $transactions,
            'summary' => $summary,
        ]);
    }

    public function show(Request $request, $id)
    {
        // $transaction = Transaction::with(['customer', 'sales', 'items.product'])
        //     ->findOrFail($id);
        $transaction = Transaction::with(['customer', 'sales', 'items' => function ($query) {
            $query->with('product:id,name,kode_gudang,type'); // Tambahkan kode_gudang
        }])->findOrFail($id);
        $detailData = [
            'id' => $transaction->id,
            'no_cor' => $transaction->no_penawaran ?? 'COR-' . str_pad($transaction->id, 4, '0', STR_PAD_LEFT),
            'customer_name' => $transaction->customer?->name ?? 'N/A',
            'customer_address' => $transaction->customer?->address ?? 'N/A',
            'sales_name' => $transaction->sales?->name ?? 'N/A',
            'status' => $transaction->transaction_type ?? 'COR',
            'divisi' => 'KCK',
            'total_pricelist' => $transaction->total_pricelist ?? 0,
            'total_net' => $transaction->total_net ?? 0,
            'total_net_net' => $transaction->total_net_net ?? 0,
            'ppn_value' => $transaction->ppn_value ?? 0,
            'total_final' => $transaction->total_final ?? 0,
            'extra_discount' => $transaction->extra_discount ?? 0,
            'operate_fee' => $transaction->operate_fee ?? 0,
            'total_discount' => $transaction->total_discount ?? 0,
            'rental_start' => $transaction->rental_start,
            'rental_end' => $transaction->rental_end,
            'install_date' => $transaction->install_date,
            'uninstall_date' => $transaction->uninstall_date,
            'pic' => $transaction->pic,
            'location' => $transaction->location,
            'delivery' => $transaction->delivery,
            'created_at' => $transaction->created_at,
            'items' => $transaction->items->map(function ($item) {
                return [
                    'product_name' => $item->product?->name ?? 'N/A',
                    'kode_gudang' => $item->product?->kode_gudang ?? 'N/A',
                    'qty' => $item->qty ?? 0,
                    'unit' => 'Unit',
                    'price_pricelist' => $item->price_pricelist ?? 0,
                    'price_deal' => $item->price_deal ?? 0,
                    'discount' => $item->discount ?? 0,
                    'discount_percent' => $item->discount_percent ?? 0,
                    'net_net' => $item->net_net ?? 0,
                ];
            })
        ];

        return Inertia::render('report/rekap/cor/detail', [
            'transaction' => $detailData,
        ]);
    }
}
