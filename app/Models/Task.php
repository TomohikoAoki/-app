<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'content',
        'shop_id',
        'position_id',
        'category_id'
    ];

    public function point() {
        return $this->hasMany('App\Models\LeaderPoint');
    }
}
