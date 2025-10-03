<?php

namespace App\Http\Controllers\Report\Rekap;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controller as BaseController;

class CorRekapController extends BaseController
{
    public function __construct()
    {
        // Semua butuh auth & verified
        $this->middleware(['auth', 'verified']);
        $this->middleware(['role:admin|manager|gm|spv|'])->only(['index', 'show']);
    }
    private function determineMainWarehouse($items)
    {
        $warehouseCounts = $items->groupBy(function ($item) {
            return $item->product->kode_gudang ?? '01';
        })->map(function ($group) {
            return $group->sum('qty');
        });

        return $warehouseCounts->keys()->first() ?? '01';
    }
    public function index(Request $request)
    {
        $tz = 'Asia/Jakarta';
        $search = trim($request->string('search')->toString() ?: $request->string('search')->toString());
        $sales = trim($request->string('sales')->toString());
        $status = trim($request->string('status')->toString());
        $month = trim($request->string('month')->toString());

        // Default ke bulan saat ini jika tidak ada filter bulan
        if (empty($month)) {
            $month = Carbon::now()->format('Y-m');
        }

        $filter = [
            'search' => $search,
            'sales' => $sales,
            'status' => $status,
            'month' => $month,
        ];

        $query = Transaction::query()->with([
            'customer:id,name',
            'sales:id,name',
            'items.product:id,code,name,description,type,price,stock,kode_gudang',
        ]);

        if ($search !== '') {
            $s = $search;
            $query->where(function ($q) use ($s) {
                $like = "%{$s}%";
                $q->where('no_penawaran', 'like', $like)
                    ->orWhere('no_po', 'like', $like)
                    ->orWhere('location', 'like', $like)
                    ->orWhere('description', 'like', $like)
                    ->orWhereHas('customer', fn($cq) => $cq->where('name', 'like', $like))
                    ->orWhereHas('sales', fn($sq) => $sq->where('name', 'like', $like));
            });
        };
        // FILTER STATUS (kecuali 'all' atau kosong)
        if ($status !== '' && strtolower($status) !== 'all') {
            $query->where('status', $status);
        }

        // FILTER SALES by NAMA (sesuai UI sekarang), abaikan 'all' / kosong
        if ($sales !== '' && strtolower($sales) !== 'all') {
            $like = "%{$sales}%";
            $query->whereHas('sales', fn($sq) => $sq->where('name', 'like', $like));
        }

        // FILTER MONTH - filter berdasarkan bulan dan tahun
        if ($month !== '') {
            $monthYear = explode('-', $month);
            if (count($monthYear) === 2) {
                $year = $monthYear[0];
                $monthNum = $monthYear[1];
                $query->whereYear('created_at', $year)
                    ->whereMonth('created_at', $monthNum);
            }
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();
        // $transactions = Transaction::with(['customer:id,name', 'sales:id,name', 'items.product:id,code,name,description,type,price,stock,kode_gudang'])
        //     ->latest()
        //     ->paginate(10);
        $transformedTransactions = $transactions->getCollection()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'customer_id' => $transaction->customer_id,
                    'sales_id' => $transaction->sales_id,
                    'no_penawaran' => $transaction->no_penawaran,
                    'no_po' => $transaction->no_po ?? '',
                    'kode_gudang' => $this->determineMainWarehouse($transaction->items),
                    'termin_of_payment' => $transaction->termin_of_payment ?? '',
                    'payment' => $transaction->payment ?? '',
                    'operate_fee' => (float) $transaction->operate_fee,
                    'jasa_sticker' => (float) $transaction->jasa_sticker,
                    'jasa_kirim' => (float) $transaction->jasa_kirim,
                    'total_pricelist' => (float) $transaction->total_pricelist,
                    'price_deal' => (float) $transaction->price_deal,
                    'total_discount' => (float) $transaction->total_discount,
                    'total_net' => (float) $transaction->total_net,
                    'extra_discount' => (float) $transaction->extra_discount,
                    'total_net_net' => (float) $transaction->total_net_net,
                    'is_ppn' => (bool) $transaction->is_ppn,
                    'ppn_value' => (float) $transaction->ppn_value,
                    'total_final' => (float) $transaction->total_final,
                    'transaction_type' => $transaction->transaction_type ?? 'rental',
                    'rental_start' => $transaction->rental_start,
                    'rental_end' => $transaction->rental_end,
                    'install_date' => $transaction->install_date,
                    'uninstall_date' => $transaction->uninstall_date,
                    'jenis_instalasi' => $transaction->jenis_instalasi,
                    'location' => $transaction->location,
                    'delivery' => $transaction->delivery,
                    'description' => $transaction->description,
                    'rental_duration' => $transaction->rental_duration,
                    'pic' => $transaction->pic ?? '',
                    'created_at' => $transaction->created_at->toISOString(),
                    'updated_at' => $transaction->updated_at->toISOString(),
                    'total_qty' => $transaction->items->sum('qty'),
                    'status' => $transaction->status ?? '',

                    // Relations
                    'customer' => $transaction->customer ? [
                        'id' => $transaction->customer->id,
                        'name' => $transaction->customer->name,
                    ] : null,

                    'sales' => $transaction->sales ? [
                        'id' => $transaction->sales->id,
                        'name' => $transaction->sales->name,
                    ] : null,

                    'items' => $transaction->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'transaction_id' => $item->transaction_id,
                            'product_id' => $item->product_id,
                            'qty' => (int) $item->qty,
                            'discount' => (float) $item->discount,
                            'discount_percent' => (float) $item->discount_percent,
                            'net_net' => (float) $item->net_net,
                            'price_deal' => (float) $item->price_deal,
                            'price_pricelist' => (float) $item->price_pricelist,
                            'price' => (float) $item->price,
                            'product' => [
                                'id' => $item->product->id,
                                'code' => $item->product->code,
                                'name' => $item->product->name,
                                'description' => $item->product->description,
                                'type' => $item->product->type,
                                'price' => (float) $item->product->price,
                                'stock' => (int) $item->product->stock,
                                'kode_gudang' => $item->product->kode_gudang,
                            ],
                        ];
                    }),
                ];
            });

        $transactions->setCollection($transformedTransactions);

        // Query untuk summary sesuai dengan filter bulan yang sama
        $summaryQuery = Transaction::with(['customer:id,name', 'items']);

        // Apply filter bulan yang sama untuk summary
        if ($month !== '') {
            $monthYear = explode('-', $month);
            if (count($monthYear) === 2) {
                $year = $monthYear[0];
                $monthNum = $monthYear[1];
                $summaryQuery->whereYear('created_at', $year)
                    ->whereMonth('created_at', $monthNum);
            }
        }

        $monthlyTransactions = $summaryQuery->get();
        $summary = [
            'total_transactions' => $monthlyTransactions->count(),
            'total_customers' => $monthlyTransactions->pluck('customer.name')->filter()->unique()->count(),
            'total_net_net' => $monthlyTransactions->sum('total_net_net'),
            'total_net_price' => $monthlyTransactions->sum('total_net'),
            'total_pricelist' => $monthlyTransactions->sum('total_pricelist'),
            'total_qty' => $monthlyTransactions->sum(function ($transaction) {
                return $transaction->items->sum('qty');
            }),
        ];
        return Inertia::render('report/rekap/cor/index', [
            'transactions' => $transactions,
            'summary' => $summary,
            'filter' => $filter,
        ]);
    }
    public function show($id)
    {
        $transaction = Transaction::with(['customer:id,name', 'sales:id,name', 'items.product:id,code,name,description,type,price,stock,kode_gudang'])
            ->findOrFail($id);
        $transformedTransaction = [
            'id' => $transaction->id,
            'customer_id' => $transaction->customer_id,
            'sales_id' => $transaction->sales_id,
            'no_penawaran' => $transaction->no_penawaran,
            'no_po' => $transaction->no_po ?? '',
            'kode_gudang' => $this->determineMainWarehouse($transaction->items),
            'termin_of_payment' => $transaction->termin_of_payment ?? '',
            'payment' => $transaction->payment ?? '',
            'operate_fee' => (float) $transaction->operate_fee,
            'jasa_sticker' => (float) $transaction->jasa_sticker,
            'jasa_kirim' => (float) $transaction->jasa_kirim,
            'total_pricelist' => (float) $transaction->total_pricelist,
            'price_deal' => (float) $transaction->price_deal,
            'total_discount' => (float) $transaction->total_discount,
            'total_net' => (float) $transaction->total_net,
            'extra_discount' => (float) $transaction->extra_discount,
            'total_net_net' => (float) $transaction->total_net_net,
            'is_ppn' => (bool) $transaction->is_ppn,
            'ppn_value' => (float) $transaction->ppn_value,
            'total_final' => (float) $transaction->total_final,
            'transaction_type' => $transaction->transaction_type ?? 'rental',
            'rental_start' => $transaction->rental_start,
            'rental_end' => $transaction->rental_end,
            'install_date' => $transaction->install_date,
            'uninstall_date' => $transaction->uninstall_date,
            'jenis_instalasi' => $transaction->jenis_instalasi,
            'location' => $transaction->location,
            'delivery' => $transaction->delivery,
            'description' => $transaction->description,
            'rental_duration' => $transaction->rental_duration,
            'pic' => $transaction->pic ?? '',
            'created_at' => $transaction->created_at->toISOString(),
            'updated_at' => $transaction->updated_at->toISOString(),
            'total_qty' => $transaction->items->sum('qty'),
            'status' => $transaction->status ?? '',

            // Relations - konsisten dengan types.ts
            'customer' => $transaction->customer ? [
                'id' => $transaction->customer->id,
                'name' => $transaction->customer->name,
            ] : null,

            'sales' => $transaction->sales ? [
                'id' => $transaction->sales->id,
                'name' => $transaction->sales->name,
            ] : null,

            // Items - konsisten dengan TransactionItem type
            'items' => $transaction->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'transaction_id' => $item->transaction_id,
                    'product_id' => $item->product_id,
                    'qty' => (int) $item->qty,
                    'discount' => (float) $item->discount,
                    'discount_percent' => (float) $item->discount_percent,
                    'net_net' => (float) $item->net_net,
                    'price_deal' => (float) $item->price_deal,
                    'price_pricelist' => (float) $item->price_pricelist,
                    'price' => (float) $item->price,
                    'product' => [
                        'id' => $item->product->id,
                        'code' => $item->product->code,
                        'name' => $item->product->name,
                        'description' => $item->product->description,
                        'type' => $item->product->type,
                        'price' => (float) $item->product->price,
                        'stock' => (int) $item->product->stock,
                        'kode_gudang' => $item->product->kode_gudang,
                    ],
                ];
            }),
        ];

        return Inertia::render('report/rekap/cor/detail', [
            'transaction' => $transformedTransaction,
        ]);
    }
}
