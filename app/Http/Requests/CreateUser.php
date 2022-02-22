<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Shop;
use Illuminate\Validation\Rule;

class CreateUser extends FormRequest
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
        //shop_id を配列化
        $shopId = Shop::get()->sort()->pluck('id')->toArray();

        return [
            'name' => ['required','unique:users,name'],
            'password' => ['required','confirmed'],
            'authority' => ['required', Rule::in(['1', '2', '3'])],
            'employee_code' => ['regex:/[0-9]{6}/','unique:profiles,employee_code','nullable'],
            'email' => ['email','unique:profiles,email','nullable'],
            'lunk' => [Rule::in(['1','2','3','4','5','6','7','8','9','10'])],
            'position_id' => [Rule::in(['1','2','3'])],
            'shop_id' => [Rule::in($shopId)],
        ];
    }

    public function attributes()
    {
        return [
            'name' => '名前',
            'password' => 'パスワード',
            'authority' => '権限',
            'employee_code' => '社員コード',
            'email' => 'メールアドレス',
            'lunk' => 'ランク/役職',
            'position_id' => 'ポジション',
            'shop_id' => '店舗'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => '名前の入力は必須です。',
            'name.unique' => '入力した名前は既に使用されています。',
            'password.required' => 'パスワードの入力は必須です。',
            'password.confirmed' => '再入力されたパスワードが違います。',
            'email.unique' => '入力されたメールアドレスは既に使用されています。',
            'employee_code.regex' => '社員コードは半角数字６桁で入力して下さい。',
            'employee_code.unique' => '入力された社員コードは既に登録されています。',
        ];
    }
}
