<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
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
                $q->where('kode_gudang', $kode);
            })
            ->limit(10)
            ->get(['id', 'name', 'kode_gudang']);

        return response()->json($products);
    }

    public function index(Request $request)
    {
        $filters = [
            'search'      => $request->string('search')->toString(),
            'type'        => $request->string('type')->toString() ?: 'all',
            'kode_gudang' => $request->string('kode_gudang')->toString() ?: 'all',
        ];

        $query = Product::query();

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
            $query->where('kode_gudang', $filters['kode_gudang']);
        }

        // paginate SETELAH filter -> total mencerminkan total hasil filter (bukan halaman aktif)
        $products = $query->orderBy('kode_gudang')
            ->paginate(10)
            ->withQueryString(); // penting agar pagination menyertakan query filter

        // opsi dropdown (distinct dari seluruh data)
        $types = Product::query()->distinct()->pluck('type');
        $warehouses = Product::query()->distinct()->pluck('kode_gudang');

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
                Rule::unique('products')->where(fn($q) => $q->where('kode_gudang', $request->input('kode_gudang')))
            ],
            'description' => 'nullable|string',
            'type' => 'required|string|in:sewa,jual,jasa',
            'stock' => 'required|integer|min:0',
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
            foreach ($this->warehouses as $warehouse) {

                $exists = Product::where('code', $validatedData['code'])
                    ->where('kode_gudang', $warehouse)->exists();
                if ($exists) {
                    continue;
                }
                $product = Product::create([
                    'name' => $validatedData['name'],
                    'code' => $validatedData['code'],
                    'description' => $validatedData['description'],
                    'type' => $validatedData['type'],
                    'kode_gudang' => $warehouse,
                    'price' => $productPrice,
                    'stock' => $validatedData['stock'],
                ]);
                $product->priceList()->create([
                    'price_1_day' => $validatedData['price_1_day'],
                    'price_3_days' => $validatedData['price_3_days'] ?? 0,
                    'price_5_days' => $validatedData['price_5_days'] ?? 0,
                    'price_7_days' => $validatedData['price_7_days'] ?? 0,
                    'price_10_days' => $validatedData['price_10_days'] ?? 0,
                    'price_30_days' => $validatedData['price_30_days'] ?? 0,
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
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load('priceList');

        return Inertia::render('product/edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'code' => $product->code,
                'description' => $product->description,
                'type' => $product->type,
                'kode_gudang' => $product->kode_gudang,
                'stock' => $product->stock,
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
            'type' => 'required|string|in:sewa,jual,jasa',
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
            'stock' => $validatedData['stock'],
        ]);

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
