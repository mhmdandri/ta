<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\OfferNumberGenerator;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = Transaction::with(['customer', 'sales', 'items.product'])->latest()->paginate(10);
        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customer = Customer::all();
        $user = User::where('role', 'sales')->get();
        return Inertia::render('transactions/create', [
            'customers' => $customer,
            'users' => $user,
        ]);
    }
    private function getAllServicePrices($items = [])
    {
        $services = [
            'operate_fee' => 0,
            'jasa_kirim' => 0,
            'jasa_sticker' => 0,
        ];

        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if ($product && $product->type === 'jasa') {
                switch ($product->name) {
                    case 'Jasa Operate':
                        $services['operate_fee'] = $item['net_net'];
                        break;
                    case 'Jasa Sticker':
                        $services['jasa_sticker'] = $item['net_net'];
                        break;
                    case 'Jasa Pengiriman':
                        $services['jasa_kirim'] = $item['net_net'];
                        break;
                }
            }
        }

        return $services;
    }

    public function store(Request $request, OfferNumberGenerator $gen)
    {
        // 1) Validasi
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'sales_id' => 'required|exists:users,id',
            'termin_of_payment' => 'required|string|in:cod,7hari,15hari,30hari',
            'payment' => 'required|string',
            'total_pricelist' => 'required|numeric',
            'price_deal' => 'required|numeric',
            'total_discount' => 'required|numeric',
            'extra_discount' => 'required|numeric',
            'total_net' => 'required|numeric',
            'total_net_net' => 'required|numeric',
            'is_ppn' => 'required|boolean',
            'ppn_value' => 'required|numeric',
            'total_final' => 'required|numeric',
            'transaction_type' => 'required|string|in:rental,sales',
            'rental_start' => 'required|date',
            'rental_end' => 'required|date|after_or_equal:rental_start',
            'rental_duration' => 'required|integer|min:1',
            'install_date' => 'nullable|date',
            'uninstall_date' => 'nullable|date|after_or_equal:install_date',
            'jenis_install' => 'nullable|in:indoor,outdoor',
            'location' => 'nullable|string',
            'delivery' => 'nullable|in:internal,vendor',
            'description' => 'nullable|string',
            'pic' => 'nullable|string',
            'no_po' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|numeric|min:0.0001',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.discount' => 'required|numeric',
            'items.*.discount_percent' => 'required|numeric',
            'items.*.net_price' => 'required|numeric|min:0',
            'items.*.net_net' => 'required|numeric|min:0',
        ]);
        $tz = config('app.timezone');
        $rentalStart = Carbon::parse($validated['rental_start'])->timezone($tz)->format('Y-m-d H:i:s');
        $rentalEnd   = Carbon::parse($validated['rental_end'])->timezone($tz)->format('Y-m-d H:i:s');
        $installDate = isset($validated['install_date'])
            ? Carbon::parse($validated['install_date'])->timezone($tz)->format('Y-m-d H:i:s')
            : null;
        $uninstallDate = isset($validated['uninstall_date'])
            ? Carbon::parse($validated['uninstall_date'])->timezone($tz)->format('Y-m-d H:i:s')
            : null;

        // 3) Jalankan semua di dalam satu transaksi DB
        return DB::transaction(function () use ($validated, $rentalStart, $rentalEnd, $installDate, $uninstallDate, $gen) {
            // 3a) Generate nomor penawaran berdasar rentalStart (agar reset per bulan konsisten)
            $refDate = Carbon::parse($rentalStart);
            $genRes   = $gen->generate('COR', 'K02', $refDate);

            // 3b) (Opsional tapi disarankan) Recalculate di server untuk menghindari manipulasi dari client
            $sumPricelist = 0;
            $sumNet       = 0;
            $sumNetNet    = 0;
            // $processedItems = $this->applyWarehouseLogic($validated['items']);
            $jasa  = $this->getAllServicePrices($validated['items']);
            foreach ($validated['items'] as $it) {
                $sumPricelist += ($it['price'] * $it['qty']);
                $sumNet       += $it['net_price']; // total harga net
                $sumNetNet    += $it['net_net'];
            }
            // 3c) Simpan transaksi
            $transaction = Transaction::create([
                'customer_id' => $validated['customer_id'],
                'sales_id' => $validated['sales_id'],
                'no_penawaran' => $genRes['no_penawaran'],
                'no_po' => $validated['no_po'] ?? null,
                'termin_of_payment' => $validated['termin_of_payment'],
                'payment' => $validated['payment'],
                'operate_fee' => $jasa['operate_fee'], // biaya operasi (jika ada)
                'jasa_kirim' => $jasa['jasa_kirim'], // biaya kirim (jika ada)
                'jasa_sticker' => $jasa['jasa_sticker'], // biaya
                'total_pricelist' => $validated['total_pricelist'], //$sumPricelist,          // override dengan kalkulasi server
                'price_deal' => $validated['price_deal'], //$priceDeal,
                'total_discount' => $validated['total_discount'], //$totalDiscount,
                'extra_discount' => $validated['extra_discount'], //$extraDiscount,
                'total_net' => $validated['total_net'], //$totalNet,
                'total_net_net' => $validated['total_net_net'], //$totalNetNet,
                'is_ppn' => $validated['is_ppn'], //$isPpn,
                'ppn_value' => $validated['ppn_value'], //$ppnValue,
                'total_final' => $validated['total_final'], //$totalFinal,
                'transaction_type' => $validated['transaction_type'],
                'rental_start' => $rentalStart,
                'rental_end' => $rentalEnd,
                'install_date' => $installDate,
                'uninstall_date' => $uninstallDate,
                'jenis_instalasi' => $validated['jenis_install'] ?? null,
                'location' => $validated['location'] ?? null,
                'delivery' => $validated['delivery'] ?? null,
                'description' => $validated['description'] ?? null,
                'rental_duration' => $validated['rental_duration'],
                'status' => 'submitted',
                'pic' => $validated['pic'] ?? null,
                'offer_counter_id' => $genRes['offer_counter_id'],   // pakai ini jika kamu simpan relasi counter
            ]);

            // 3d) Simpan items (pakai createMany biar ringkas)
            $items = array_map(function ($it) {
                return [
                    'product_id' => $it['product_id'],
                    'qty' => $it['qty'],
                    'price_pricelist' => $it['price'],
                    'price_deal' => $it['net_price'],
                    'discount' => $it['discount'],
                    'discount_percent' => $it['discount_percent'],
                    'net_net' => $it['net_net'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $validated['items']);

            $transaction->items()->createMany($items);

            return redirect()->route('transactions.index')->with('success', 'Berhasil tambahkan transaksi!');
        });
    }
    public function show(Transaction $transaction)
    {
        $transaction->load(['customer', 'sales', 'items.product']);
        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
