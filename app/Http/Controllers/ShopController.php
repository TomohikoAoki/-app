<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\models\Shop;

class ShopController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except('index');
    }

    public function index()
    {
            return Shop::get();
    }


    public function register(Request $request)
    {
        Shop::create([
            'shop_name' => $request->get('shopname'),
        ]);

        $shop = Shop::all();

        return response($shop, 201);
    }
}
