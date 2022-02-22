<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'employee_code',
        'shop_id',
        'user_id',
        'position_id',
        'lunk',
        'email'
    ];

    public $timestamps = false;

    public function user() {
        return $this->belongsTo('App\Models\user');
    }
}
