<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class RegisterApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     */
    public function should_新しいユーザーを作成して返却する()
    {
        $data = [
            'name' => 'tomohiko',
            'password' => 'aoki1234',
            'password_confirmation' => 'aoki1234',
            'employee_code' => '000039',
            'shop_id' => 1,
            'position_id' => 1,
            'authority' => 1,
            'lunk' => 1,
            'email' => 'aoki@ton-q.com',
        ];

        $response = $this->json('POST', route('register'), $data);

        $user = User::first();
        $this->assertEquals($data['name'], $user['name']);

        $response->assertStatus(201)->assertJson(['name' => $user->name]);
    }

}
