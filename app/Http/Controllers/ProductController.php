<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function search(Request $request)
    // {
    //     $query = $request->get('q', '');
    //     $products = Product::where('name', 'like', "%{$query}%")
    //         ->limit(10)
    //         ->get(['id', 'name']); // hanya ambil yg diperlukan

    //     return response()->json($products);
    // }
    public function search(Request $request)
    {
        // $query = $request->get('q', '');
        // $kode  = $request->get('kode_gudang', '');

        // $products = Product::query()
        //     ->when(
        //         $query,
        //         fn($q) =>
        //         $q->where('name', 'like', "%{$query}%")
        //             ->orWhere('code', 'like', "%{$query}%")
        //     )
        //     ->when(
        //         $kode,
        //         fn($q) =>
        //         $q->where('kode_gudang', $kode)
        //     )
        //     ->limit(10)
        //     ->get(['id', 'name', 'kode_gudang']); // bisa tambahkan kolom lain jika perlu

        // return response()->json($products);
        // $q = $request->get('q', '');
        // $kode = $request->get('kode_gudang', null);

        // $query = Product::query()
        //     ->when($q, fn($qq) => $qq->where('name', 'like', "%$q%")->orWhere('code', 'like', "%$q%"))
        //     ->when($kode, fn($qq) => $qq->where('kode_gudang', $kode))
        //     ->limit(20);

        // return $query->get();
        // pastikan bersih dari spasi & null
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

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
