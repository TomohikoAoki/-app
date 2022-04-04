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
            ['id' => 1, 'shop_name' => 'とんＱつくば本店'],
            ['id' => 2, 'shop_name' => 'とんＱ水戸千波店'],
            ['id' => 3,'shop_name' => 'とんＱ守谷ふれあい店'],
            ['id' => 4,'shop_name' => 'とんＱ成田ニュータウン店'],
            ['id' => 5,'shop_name' => 'とんＱ春日部店'],
            ['id' => 6,'shop_name' => 'とんＱふじみ野店'],
            ['id' => 7,'shop_name' => 'とんＱイーアスつくば店'],
            ['id' => 8,'shop_name' => 'とんＱ柏高島屋店'],
            ['id' => 9,'shop_name' => '赤牛つくば本店'],
            ['id' => 10,'shop_name' => '赤牛守谷店'],
            ['id' => 11,'shop_name' => 'アルゾーニ・イタリア'],
            ['id' => 12,'shop_name' => '本部'],
            ['id' => 99, 'shop_name' => '店舗共通'],
        ];

        DB::table('shops')->insert($shopData);
    }
}
