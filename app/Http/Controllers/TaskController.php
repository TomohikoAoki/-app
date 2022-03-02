<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function createTask(Request $request)
    {
        $task = Task::create([
            'content' => $request['content'],
            'category_id' => $request['category_id'],
            'shop_id' => $request['shop_id'],
            'position_id' => $request['position_id'],
        ]);

        return response($task, 201);
    }

    public function editTask(Request $request)
    {
        Task::where('id', $request['id'])->update([
            'content' => $request['content'],
        ]);
    }

    public function deleteTask()
    {
    }

    public function indexTask(Request $request)
    {
        $shopId = $request->input('shop');
        $positionId = $request->input('position');

        return Task::where('shop_id', $shopId)->where('position_id', $positionId)->orderByRaw('category_id asc', 'id asc')->get();
    }
}
