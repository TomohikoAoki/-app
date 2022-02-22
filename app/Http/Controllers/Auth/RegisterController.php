<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        $user = DB::transaction(function () use ($data) {
            $u = User::create([
                'name' => $data['name'],
                'password' => Hash::make($data['password']),
                'authority' => $data['authority'],
            ]);

            Profile::create([
                'employee_code' => $data['employee_code'],
                'shop_id' => $data['shop_id'],
                'user_id' => $u['id'],
                'position_id' => $data['position_id'],
                'lunk' => $data['lunk'],
                'email' => $data['email']
            ]);

            return $u;
        });

        return $user;
    }

    protected function registered(Request $request, $user)
    {
        return User::find($user['id'])->profile()->get();
    }
}
