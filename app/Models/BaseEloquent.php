<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class BaseEloquent extends Model
{
    /**
     * @param  string         $tgtClass                       関係を結ぶテーブルクラス
     * @param  string         $throughClass                   通る中間テーブルクラス
     * @param  string         $throughHasThisPrimaryKeyColumn 中間テーブルの持つ$thisの主キーを指すカラム
     * @param  string         $throughHasTgtPrimaryKeyColumn  中間テーブルの持つ関係先の主キーを指すカラム
     * @return HasManyThrough
     */
    public function hasManyThroughWrapper(
        string $tgtClass,
        string $throughClass,
        string $throughHasThisPrimaryKeyColumn,
        string $throughHasTgtPrimaryKeyColumn
    ): HasManyThrough {
        return $this->hasManyThrough(
            $tgtClass,
            $throughClass,
            $throughHasThisPrimaryKeyColumn,
            (new $tgtClass())->getKeyName(),
            $this->getKeyName(),
            $throughHasTgtPrimaryKeyColumn
        );
    }
}
