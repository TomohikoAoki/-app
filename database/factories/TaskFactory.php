<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Task;
use Faker\Generator as Faker;

$factory->define(Task::class, function (Faker $faker) {
    return [
        'content' => $faker->realText(50),
        'category_id' => $faker->numberBetween(1, 7),
        'shop_id' => 1,
        'position_id' => 1,
    ];
});
