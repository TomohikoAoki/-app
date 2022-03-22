<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PointResource;

class UserWithPointResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'authority' => $this->authority,
            'lunk' => $this->profile->lunk,
            'position_id' => $this->profile->position_id,
            'points' => PointResource::collection($this->points)
        ];
    }
}
