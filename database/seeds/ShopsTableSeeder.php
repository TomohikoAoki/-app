<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShopsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $shopData = [
            ['shop_name' => 'とんＱつくば本店'],
            ['shop_name' => 'とんＱ水戸千波店'],
            ['shop_name' => 'とんＱ守谷ふれあい店'],
            ['shop_name' => 'とんＱ成田ニュータウン店'],
            ['shop_name' => 'とんＱ春日部店'],
            ['shop_name' => 'とんＱふじみ野店'],
            ['shop_name' => 'とんＱイーアスつくば店'],
            ['shop_name' => 'とんＱ柏高島屋店'],
            ['shop_name' => '赤牛つくば本店'],
            ['shop_name' => '赤牛守谷店'],
            ['shop_name' => 'アルゾーニ・イタリア'],
            ['shop_name' => '本部'],
        ];

        DB::table('shops')->insert($shopData);
    }
}
