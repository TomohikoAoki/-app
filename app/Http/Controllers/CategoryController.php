<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\models\Shop;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except('index');
    }

    public function index() {
        return Category::get();
    }

    public function create(Request $request)
    {
        logger($request);


        $category = Category::create([
            'label' => $request['label'],
            'position_id' => $request['position_id']
        ]);

        return response($category, 201);
    }

    public function update(Request $request)
    {
        Category::where('id', $request['id'])->update([
            'label' => $request['label'],
            'position_id' => $request['position_id']
        ]);
    }

    public function delete(Request $request)
    {
        Category::where('id', $request['id'])->delete();
    }

    public function createUsedShop (Request $request)
    {
        $shop = Shop::where('id', $request['shop_id'])->first();

        $shop->used_category = serialize($request['used_category']);;

        $shop->save();

        return response($shop, 200);
    }

    public function indexUsedShop (String $id)
    {
        $shop = Shop::where('id', $id)->first();

        return response(unserialize($shop['used_category']), 200);
    }
}
