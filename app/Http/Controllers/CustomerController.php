<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class CustomerController extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        // Semua butuh auth & verified
        $this->middleware(['auth', 'verified']);

        // Khusus action create & store hanya admin
        $this->middleware(['role:admin|sales|manager'])->only(['create', 'store']);
        // Kalau mau, update & delete juga dibatasi
        $this->middleware(['role:admin|manager'])->only(['edit', 'update']);
        $this->middleware(['role:admin|manager'])->only(['destroy']);
    }
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $customers = Customer::where('name', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'name']); // hanya ambil yg diperlukan

        return response()->json($customers);
    }
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->string('search')->toString()
        ];
        $query = Customer::query();
        if ($filters['search']) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                    ->orWhere('code', 'like', "%{$s}%");
            });
        }
        $customers = $query->orderBy('name')->paginate(10)->withQueryString();
        return Inertia::render('customers/index', [
            'customers' => $customers,
            'filters'   => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('customers/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'    => 'required|string|max:255',
            'code'    => 'required|string|max:50|unique:customers,code',
            'address' => 'nullable|string|max:500',
            'phone'   => 'required|string|max:20',
            'npwp'    => 'nullable|string|max:20',
            'email'   => 'nullable|email|max:100|unique:customers,email',
        ]);
        $cek = Customer::where('code', $validatedData['code'])->first();
        if ($cek) {
            return redirect()->back()->withErrors(['code' => 'Kode pelanggan sudah digunakan.'])->withInput();
        }
        Customer::create($validatedData);
        return redirect()->route('customers.index')->with('success', 'Customer berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        return Inertia::render('customers/edit', [
            'customer' => $customer
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        $validatedData = $request->validate([
            'name'    => 'required|string|max:255',
            'code'    => 'required|string|max:50|unique:customers,code,' . $customer->id,
            'address' => 'nullable|string|max:500',
            'phone'   => 'required|string|max:20',
            'npwp'    => 'nullable|string|max:20',
            'email'   => 'nullable|email|max:100|unique:customers,email,' . $customer->id,
        ]);
        $customer->update($validatedData);
        return redirect()->route('customers.index')->with('success', 'Customer berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->route('customers.index')->with('success', 'Customer berhasil dihapus.');
    }
}
