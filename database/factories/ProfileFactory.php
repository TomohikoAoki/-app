<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Profile;
use App\Models\User;
use Faker\Generator as Faker;

$factory->define(Profile::class, function (Faker $faker) {
    $users = User::all();

    return [
        'email' => $faker->unique()->email(),
        'shop_id' => $this->faker->numberBetween(1,11),
        'position_id' => $faker->numberBetween(1,2),
        'employee_code' => $faker->regexify('[0-9]{6}'),
        'user_id' => $this->faker->unique()->numberBetween(2, $users->count()),
        'lunk' => $faker->numberBetween(1,10),
    ];
});
