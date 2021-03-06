<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserDetailResource extends JsonResource
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
            'shop_id' => $this->profile->shop_id,
            'employee_code' => $this->profile->employee_code,
            'position_id' => $this->profile->position_id,
            'lunk' => $this->profile->lunk,
            'email' => $this->profile->email
        ];
    }
}
