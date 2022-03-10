<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaderPoint;

class LeaderPointController extends Controller
{
    public function getTaskAndPointByUserId()
    {
        $userId = "1";

        $points = User::find($userId)->givenPoints()->get();

        $profile = Profile::where('user_id', $userId)->first();

        $tasks = Shop::find($profile->shop_id)->tasks()->where('position_id', $profile->position_id)->get();
    }

    public function putPoint(Request $request)
    {
        $list = ($request['givenPointList']);
        foreach ($list as $item) {
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
