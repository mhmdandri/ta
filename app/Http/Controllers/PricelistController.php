<?php

namespace App\Http\Controllers;

use App\Models\Pricelist;

class PricelistController extends Controller
{
    public function show($productId)
    {
        $pricelist = Pricelist::where('product_id', $productId)->first();

        if (!$pricelist) {
            return response()->json(['message' => 'Pricelist not found'], 404);
        }

        return response()->json($pricelist);
    }
}
