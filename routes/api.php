<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//会員登録
Route::post('/register', 'Auth\RegisterController@register')->name('register');

//ログイン
Route::post('/login', 'Auth\LoginController@login')->name('login');

//ログアウト
Route::post('/logout', 'Auth\LoginController@logout')->name('logout');

//ログインユーザー
Route::get('/user', 'Api\AuthController@authUser')->name('user');

//登録ユーザー取得
Route::get('/user/get/{shop_id}', 'Api\AuthController@getUser')->name('user.all');

//ユーザーエディットフォーム　IDからユーザー取得
Route::get('/user/detail/{id}', 'Api\AuthController@getUserById');

//ユーザー情報アップデート
Route::put('/user/detail/{id}', 'Api\AuthController@updateUser');

//ユーザー削除
Route::delete('/user/detail/{id}', 'Api\AuthController@deleteUser');

//会員作成
Route::post('/user/create', 'Api\AuthController@createUser')->name('user.create');

//店舗登録
Route::post('/shop/register', 'ShopController@register')->name('shop-register');

//店舗インデックス
Route::get('/shop/index', 'ShopController@index')->name('shop.index');

//タスク作成
Route::post('/task', 'TaskController@createTask');

//タスク修正
Route::put('/task', 'TaskController@editTask');

//タスク削除
Route::delete('/task', 'TaskController@deleteTask');

//タスク一覧取得
Route::get('/task', 'TaskController@indexTask');

//リーダーポイント　追加
Route::post('/point', 'LeaderPointController@putPoint');

//ユーザー別リーダーポイント　取得
Route::get('/point', 'LeaderPointController@getPointByUserId');


