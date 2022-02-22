<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    protected $fillable = [
        'shop_name',
    ];

    public $timestamps = false;

}
