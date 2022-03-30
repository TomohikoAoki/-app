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
        $user = User::find($request->input('user_id'));

        return new UserWithPointResource($user);
    }

    public function getPointsWithUsersBelongToShop(string $shopId)
    {
       $users = Shop::find($shopId)->users()->where('authority', 3)->get();

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

        return response('', 201);
    }
}
