<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Shop;

class ShopRegisterApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     */
    public function should_新しい店舗を作成して返却する()
    {
        $data = [
            'shopname' => 'とんＱつくば本店',
        ];

        $this->json('POST', route('shop-register', $data));

        $shop = Shop::first();
        $this->assertEquals($data['shopname'], $shop['shop_name']);
    }
}
