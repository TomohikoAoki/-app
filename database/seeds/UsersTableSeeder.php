<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = new User([
            'name' => 'master',
            'password' => Hash::make('master1234'),
            'authority' => 1,
        ]);
        $user->save();

        factory(User::class, 50)->create();
    }
}
