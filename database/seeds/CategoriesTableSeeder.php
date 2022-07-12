<?php

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $category = new Category([
            'label' => 'NHK・身だしなみ',
            'position_id' => 3,
        ]);
        $category->save();
    }
}
