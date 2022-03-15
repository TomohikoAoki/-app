<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaderPoint;
use App\Models\User;

class LeaderPointController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getPointByUserId(Request $request)
    {
        $userId = $request->input('user_id');
        $points = User::find($userId)->givenPoints()->get();

        return response($points, 200);
    }

    public function putPoint(Request $request)
    {
        $data = $request['pointList'];
        logger($request);
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
