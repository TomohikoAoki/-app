<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Validation\Rule;

class PutPoints extends FormRequest
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
        $taskId = Task::get()->pluck('id')->toArray();
        $userId = User::get()->pluck('id')->toArray();

        return [
            '*.point' => ['required',Rule::in(['1','2','3','4','5'])],
            '*.task_id' => ['required', Rule::in($taskId)],
            '*.user_id' => ['required', Rule::in($userId)],
        ];
    }
}
