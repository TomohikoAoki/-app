<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaderPoint extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'task_id',
        'user_id',
        'point',
    ];

    public function user(){
        return $this->belongsTo('App\Models\User');
    }

    public function task(){
        return $this->belongsTo('App\Models\Task');
    }
}
