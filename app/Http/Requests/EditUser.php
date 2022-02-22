<?php

namespace App\Http\Requests;

use App\Http\Requests\CreateUser;
use Illuminate\Validation\Rule;

class EditUser extends CreateUser
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rule = parent::rules();

        unset($rule['password']);

        return [
            'name' => ['required', Rule::unique('users','name')->whereNot('id',$this->id)],
            'email' => ['email','nullable',Rule::unique('profiles', 'email')->whereNot('user_id',$this->id)],
            'employee_code' => ['regex:/[0-9]{6}/','nullable',Rule::unique('profiles','employee_code')->whereNot('user_id',$this->id),]
        ] + $rule;
    }

    public function messages()
    {
        $messages = parent::messages();

        return $messages;
    }
}
