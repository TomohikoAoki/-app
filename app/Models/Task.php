<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'content',
        'shop_id',
        'position_id',
        'category_id'
    ];
}
