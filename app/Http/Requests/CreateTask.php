<?php

namespace App\Http\Requests;

use App\Models\Category;
use App\Models\Shop;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateTask extends FormRequest
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
        $categoryId = Category::get()->pluck('id')->toArray();
        $shopId = Shop::get()->pluck('id')->toArray();

        return [
            'category_id' => ['required', Rule::in($categoryId)],
            'content' => ['required', 'string', 'max:100'],
            'position_id' => ['required', Rule::in([1,2,3])],
            'shop_id' => ['required', Rule::in($shopId)]
        ];
    }
}
