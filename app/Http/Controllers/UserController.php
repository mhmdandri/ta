<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $sales = User::where('name', 'like', "%{$query}%")
            ->where('role', 'sales')
            ->where('is_sales_enabled', true)
            ->limit(10)
            ->get(['id', 'name']); // hanya ambil yg diperlukan

        return response()->json($sales);
    }
    public function index(Request $request)
    {
        $filter = $request->get('filter', '');
        $users = User::query()
            ->when($filter, function ($query, $filter) {
                return $query->where('name', 'like', "%{$filter}%")
                    ->orWhere('email', 'like', "%{$filter}%");
            })->get();
        return Inertia::render('users/index', [
            'users' => $users,
            'filter' => $filter
        ]);
    }
    public function create()
    {
        $spv = User::where('role', 'spv')->get();
        return Inertia::render('users/create', [
            'spv' => $spv
        ]);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,sales,finance,spv,manager',
        ]);
        $cekEmail = User::where('email', $request->email)->first();
        if ($cekEmail) {
            return redirect()->back()->withErrors(['error' => 'Email sudah digunakan.'])->withInput();
        }
        if (!$request->supervisor_id && $validatedData['role'] === 'sales') {
            return redirect()->back()->withErrors(['error' => 'Supervisor harus dipilih.'])->withInput();
        }
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
            'role' => $validatedData['role'],
            'target_sales' => $request->target_sales ?? null,
            'supervisor_id' => $request->supervisor_id ?? null,
        ]);
        $user->save();
        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan.');
    }
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }
    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'role' => 'required|in:admin,sales,spv,manager',
        ]);
        $user->role = $validatedData['role'];
        $user->save();
        return redirect()->route('users.index')->with('success', 'Role user berhasil diupdate.');
    }
    // public function indexTarget()
    // {
    //     return Inertia::render('users/targets');
    // }
}
