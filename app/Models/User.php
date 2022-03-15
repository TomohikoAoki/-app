<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $with = ['profile'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'password','authority'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token','created_at','updated_at'
    ];

    /**
     * リレーション
     * @return hasOne
     */
    public function profile()
    {
        return $this->hasOne('App\Models\profile');
    }

    /**
     * リレーション
     * @return hasMany
     */
    public function givenPoints()
    {
        return $this->hasMany('App\Models\LeaderPoint');
    }

    /**
     * リレーション
     *
     */
    public function givenPointedTasks()
    {
        return $this->hasManyThrough(Task::class, LeaderPoint::class, 'user_id', 'id', null, 'task_id');
    }


}
