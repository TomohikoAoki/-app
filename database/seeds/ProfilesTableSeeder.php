<?php

use Illuminate\Database\Seeder;
use App\Models\Profile;

class ProfilesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $profile = new Profile([
            'email' => 'aoki@ton-q.com',
            'shop_id' => 12,
            'position_id' => 3,
            'employee_code' => '000000',
            'user_id' => 1,
            'lunk' => 1,
        ]);
        $profile->save();

        factory(Profile::class, 50)->create();
    }
}
