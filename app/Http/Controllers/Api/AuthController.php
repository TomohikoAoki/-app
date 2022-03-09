<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUser;
use App\Http\Requests\EditUser;
use App\Http\Resources\UserDetailResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Shop;
use App\Models\Profile;

class AuthController extends Controller
{
    /**
     * authUser 以外
     * ログイン状態での認可
     */
    public function __construct()
    {
        $this->middleware('auth')->except('authUser');
    }

    /**
     *
     * 現在のログインユーザー取得
     * @return UserResource|null
     */
    public function authUser()
    {
        if (Auth::check()) {
            $user = User::find(Auth::user()->id);
            return new UserResource($user);
        } else {
            return response()->json();
        }
    }

    /**
     * ユーザー登録
     * @return UserResource
     */
    public function createUser(CreateUser $request)
    {
        $user = DB::transaction(function () use ($request) {
            $u = User::create([
                'name' => $request['name'],
                'password' => Hash::make($request['password']),
                'authority' => $request['authority'],
            ]);

            Profile::create([
                'employee_code' => $request['employee_code'],
                'shop_id' => $request['shop_id'],
                'user_id' => $u['id'],
                'position_id' => $request['position_id'],
                'lunk' => $request['lunk'],
                'email' => $request['email'],
            ]);

            return $u;
        });

        return response(new UserResource($user), 201);
    }

    /**
     * 全てのユーザー取得
     * 店舗リーダーの場合は店舗のユーザー取得
     * @return UserResource
     */
    public function getUser(string $shop_id)
    {
        if ($shop_id === "0") {
            return UserResource::collection(User::all());
        }

        $users = Shop::find($shop_id)->users()->get();

        return UserResource::collection($users);
    }

    /**
     * ユーザー詳細　ユーザー情報変更フォーム
     * @return UserDetailResource
     */
    public function getUserById(string $id)
    {
        return new UserDetailResource(User::find($id));
    }

    /**
     * ユーザー情報更新
     * @return UserResource
     */
    public function updateUser(EditUser $request, string $id)
    {
        DB::transaction(function () use ($request, $id) {
            User::where('id', $id) ->update([
                'name' => $request['name'],
                'authority' => $request['authority'],
            ]);

            Profile::where('user_id', $id)
            ->update([
                'employee_code' => $request['employee_code'],
                'lunk' => $request['lunk'],
                'position_id' => $request['position_id'],
                'email' => $request['email'],
                'shop_id' => $request['shop_id'],
            ]);
        });


        return new UserResource(User::find($id));
    }

    /**
     * ユーザー削除
     */
    public function deleteUser(string $id)
    {
        if (Auth::user()->id != $id) {
            User::findOrFail($id)
            ->delete();

            return response('',200);
        };

        //自分で自分を削除だったらログアウト処理
        return response('',405);
    }

}
