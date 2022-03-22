<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\UserWithPointResource;
use App\Models\LeaderPoint;
use App\Models\User;
use App\Models\Shop;

class LeaderPointController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getPointByUserId(Request $request)
    {
        $userId = $request->input('user_id');
        $points = User::find($userId)->points()->get();

        return response($points, 200);
    }

    public function getPointsWithUsersBelongToShop(string $shopId)
    {
       $users = Shop::find($shopId)->users()->get();

       return UserWithPointResource::collection($users);
    }

    public function putPoint(Request $request)
    {
        $data = $request->all();
        foreach ($data as $item) {
            if (!$item['id']) {
                unset($item['id']);
                LeaderPoint::create($item);
            } else {
                LeaderPoint::where('id', $item['id'])->update($item);
            }

        }

        return response('', 200);
    }
}
