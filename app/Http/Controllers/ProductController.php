<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;

class ProductController extends BaseController
{
    public function __construct()
    {
        // Semua butuh auth & verified
        $this->middleware(['auth', 'verified']);

        // Khusus action create & store hanya admin
        $this->middleware(['role:admin|manager|sales|spv|gm'])->only(['create', 'store']);
        // Kalau mau, update & delete juga dibatasi|gm
        $this->middleware(['role:admin|manager|gm'])->only(['edit', 'update']);
        $this->middleware(['role:admin|manager|gm'])->only(['destroy']);
    }
    private $warehouses = ['01', '02', '04'];
    public function search(Request $request)
    {
        $query = trim((string) $request->query('q', ''));
        $kode  = trim((string) $request->query('kode_gudang', ''));

        $products = Product::query()
            // filter text (opsional)
            ->when($query !== '', function ($q) use ($query) {
                $q->where(function ($qq) use ($query) {
                    $qq->where('name', 'like', "%{$query}%")
                        ->orWhere('code', 'like', "%{$query}%");
                });
            })
            // filter WAJIB: kode_gudang
            ->when($kode !== '', function ($q) use ($kode) {
                $q->whereHas('stocks', function ($s) use ($kode) {
                    $s->where('kode_gudang', $kode);
                });
            })
            ->limit(10)
            ->with(['stocks' => function ($q) use ($kode) {
                $q->where('kode_gudang', $kode);
            }])
            ->get(['id', 'name', 'code']);

        return response()->json($products);
    }

    public function index(Request $request)
    {
        $filters = [
            'search'      => $request->string('search')->toString(),
            'type'        => $request->string('type')->toString() ?: 'all',
            'kode_gudang' => $request->string('kode_gudang')->toString() ?: 'all',
        ];

        //$query = Product::query();
        $query = Product::with('stocks', 'priceList');

        if ($filters['search']) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                    ->orWhere('code', 'like', "%{$s}%");
            });
        }

        if ($filters['type'] !== 'all') {
            $query->where('type', $filters['type']);
        }

        if ($filters['kode_gudang'] !== 'all') {
            $query->whereHas('stocks', function ($q) use ($filters) {
                $q->where('kode_gudang', $filters['kode_gudang']);
            });
        }

        // paginate SETELAH filter -> total mencerminkan total hasil filter (bukan halaman aktif)
        $products = $query->orderBy('code')
            ->paginate(10)
            ->withQueryString(); // penting agar pagination menyertakan query filter

        // opsi dropdown (distinct dari seluruh data)
        $types = Product::query()->distinct()->pluck('type');
        $warehouses = ProductStock::query()->distinct()->pluck('kode_gudang');

        return Inertia::render('product/index', [
            'products'    => $products,
            'filters'     => $filters,
            'options'     => [
                'types'       => $types,
                'warehouses'  => $warehouses,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('product/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'code' => [
                'required',
                'string',
                'max:50',
                // kalau unique-nya kombinasi code + kode_gudang:
                Rule::unique('products', 'code')
            ],
            'description' => 'nullable|string',
            'type' => 'required|string|in:sewa,jual,jasa',
            'stock' => 'required|integer|min:0',
            'kode_gudang' => 'required|string|in:01,02,04',
            'price_1_day' => 'required|numeric|min:0',
            'price_3_days' => 'required|numeric|min:0',
            'price_5_days' => 'required|numeric|min:0',
            'price_7_days' => 'required|numeric|min:0',
            'price_10_days' => 'required|numeric|min:0',
            'price_30_days' => 'required|numeric|min:0',
        ]);
        $isJual = $validatedData['type'] === 'jual';
        $isJasa = $validatedData['type'] === 'jasa';
        $productPrice = ($isJual || $isJasa) ? ($validatedData['price_1_day'] ?? 0) : 0;

        try {
            // foreach ($this->warehouses as $warehouse) {
            //     $exists = Product::where('code', $validatedData['code'])
            //         ->where('kode_gudang', $warehouse)->exists();
            //     if ($exists) {
            //         continue;
            //     }
            //     $product = Product::create([
            //         'name' => $validatedData['name'],
            //         'code' => $validatedData['code'],
            //         'description' => $validatedData['description'],
            //         'type' => $validatedData['type'],
            //         'kode_gudang' => $warehouse,
            //         'price' => $productPrice,
            //         'stock' => $validatedData['stock'],
            //     ]);
            //     $product->priceList()->create([
            //         'price_1_day' => $validatedData['price_1_day'],
            //         'price_3_days' => $validatedData['price_3_days'] ?? 0,
            //         'price_5_days' => $validatedData['price_5_days'] ?? 0,
            //         'price_7_days' => $validatedData['price_7_days'] ?? 0,
            //         'price_10_days' => $validatedData['price_10_days'] ?? 0,
            //         'price_30_days' => $validatedData['price_30_days'] ?? 0,
            //     ]);
            // }
            $product = Product::create([
                'name' => $validatedData['name'],
                'code' => $validatedData['code'],
                'description' => $validatedData['description'],
                'type' => $validatedData['type'],
                'price' => $productPrice,
            ]);
            $product->priceList()->create([
                'price_1_day' => $validatedData['price_1_day'],
                'price_3_days' => $validatedData['price_3_days'] ?? 0,
                'price_5_days' => $validatedData['price_5_days'] ?? 0,
                'price_7_days' => $validatedData['price_7_days'] ?? 0,
                'price_10_days' => $validatedData['price_10_days'] ?? 0,
                'price_30_days' => $validatedData['price_30_days'] ?? 0,
            ]);
            if ($validatedData['type'] === 'jasa') {
                // hanya gudang 01
                ProductStock::create([
                    'product_id' => $product->id,
                    'kode_gudang' => '01',
                    'stock' => $validatedData['stock'],
                ]);
            } else {
                ProductStock::create([
                    'product_id' => $product->id,
                    'kode_gudang' => $validatedData['kode_gudang'],
                    'stock' => $validatedData['stock'],
                ]);
            }
            return redirect()->route('product.index')
                ->with('success', 'Produk berhasil ditambahkan');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Gagal menambahkan produk: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function rental(Request $request)
    {
        $today = now();

        $transactions = Transaction::with([
            'customer',
            'items' => function ($q) {
                $q->select(
                    'id',
                    'transaction_id',
                    'product_id',
                    'qty',
                    'kode_gudang' // 🔥 WAJIB
                )->with('product:id,name,code,type');
            },
        ])->where('status', 'confirmed')
            ->whereDate('rental_end', '>=', now()->subDays(30))
            ->orderBy('rental_end', 'asc')
            ->get();

        return Inertia::render('product/rental', [
            'transactions' => $transactions
        ]);
    }
    public function show(Product $product)
    {
        //
    }

    public function transfer(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'from_kode_gudang' => 'required',
            'to_kode_gudang' => 'required|different:from_kode_gudang',
            'qty' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request) {

            // ✅ KURANGI DARI GUDANG ASAL
            DB::table('product_stocks')
                ->where('product_id', $request->product_id)
                ->where('kode_gudang', $request->from_kode_gudang)
                ->decrement('stock', $request->qty);

            // ✅ TAMBAH KE GUDANG TUJUAN
            DB::table('product_stocks')->updateOrInsert(
                [
                    'product_id' => $request->product_id,
                    'kode_gudang' => $request->to_kode_gudang,
                ],
                [
                    'stock' => DB::raw("COALESCE(stock,0) + {$request->qty}")
                ]
            );
        });

        return back()->with('success', 'Transfer berhasil');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load(['priceList', 'stocks']);

        return Inertia::render('product/edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'code' => $product->code,
                'description' => $product->description,
                'type' => $product->type,
                'stocks' => $product->stocks,
                'price_list' => $product->priceList ? [
                    'price_1_day' => $product->priceList->price_1_day,
                    'price_3_days' => $product->priceList->price_3_days,
                    'price_5_days' => $product->priceList->price_5_days,
                    'price_7_days' => $product->priceList->price_7_days,
                    'price_10_days' => $product->priceList->price_10_days,
                    'price_30_days' => $product->priceList->price_30_days,
                ] : null,
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $kodeGudang = $request->input('kode_gudang', $product->kode_gudang);
        $allowedTypes = array_unique(array_merge(['sewa', 'jual', 'jasa']));
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'code' => [
                'required',
                'string',
                'max:100',
                // unique berdasarkan (code,kode_gudang) tapi abaikan baris $product->id
                Rule::unique('products', 'code')
                    ->ignore($product->id)
                    ->where(fn($q) => $q->where('kode_gudang', $kodeGudang)),
            ],
            'description' => 'nullable|string',
            'type' => 'required|string|in:' . implode(',', $allowedTypes),
            'stock' => 'required|integer|min:0',
            'price_1_day' => 'required|numeric|min:0',
            'price_3_days' => 'nullable|numeric|min:0',
            'price_5_days' => 'nullable|numeric|min:0',
            'price_7_days' => 'nullable|numeric|min:0',
            'price_10_days' => 'nullable|numeric|min:0',
            'price_30_days' => 'nullable|numeric|min:0',
        ]);
        $isJual = $validatedData['type'] === 'jual';
        $isJasa = $validatedData['type'] === 'jasa';
        $productPrice = ($isJual || $isJasa) ? ($validatedData['price_1_day'] ?? 0) : 0;
        // Update product
        $product->update([
            'name' => $validatedData['name'],
            'code' => $validatedData['code'],
            'description' => $validatedData['description'],
            'type' => $validatedData['type'],
            'price' => $productPrice,
        ]);
        if ($validatedData['type'] === 'jasa') {
            // hapus selain gudang 01
            ProductStock::where('product_id', $product->id)
                ->where('kode_gudang', '!=', '01')
                ->delete();

            // update / create gudang 01
            ProductStock::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'kode_gudang' => '01',
                ],
                [
                    'stock' => $validatedData['stock'],
                ]
            );
        } else {
            foreach ($this->warehouses as $warehouse) {
                ProductStock::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'kode_gudang' => $warehouse,
                    ],
                    [
                        'stock' => $validatedData['stock'],
                    ]
                );
            }
        }

        // Update or create price list
        $product->priceList()->updateOrCreate(
            ['product_id' => $product->id],
            [
                'price_1_days' => $validatedData['price_1_day'],
                'price_3_days' => $validatedData['price_3_days'] ?? 0,
                'price_5_days' => $validatedData['price_5_days'] ?? 0,
                'price_7_days' => $validatedData['price_7_days'] ?? 0,
                'price_10_days' => $validatedData['price_10_days'] ?? 0,
                'price_30_days' => $validatedData['price_30_days'] ?? 0,
            ]
        );

        return redirect()->route('product.index')
            ->with('success', 'Produk berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->priceList()->delete();
        $product->delete();
        return redirect()->route('product.index')
            ->with('success', 'Produk berhasil dihapus');
    }
}
