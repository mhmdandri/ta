<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $sales = User::where('name', 'like', "%{$query}%")
            ->where('role', 'sales')
            ->limit(10)
            ->get(['id', 'name']); // hanya ambil yg diperlukan

        return response()->json($sales);
    }
}
