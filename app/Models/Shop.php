<?php

namespace App\models;

use App\Models\BaseEloquent;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Shop extends BaseEloquent
{
    protected $fillable = [
        'shop_name', 'used_category'
    ];

    public $timestamps = false;

    /**
     * リレーションシップ
     * @return HasManyThrough
     */
    public function users(): HasManyThrough
    {
        return $this->hasManyThroughWrapper(User::class, Profile::class, 'shop_id', 'user_id');
    }

    public function profiles(): HasMany
    {
        return $this->hasMany('App\Models\Profile');
    }

    public function tasks()
    {
        return $this->hasMany('App\Models\Task');
    }

}
