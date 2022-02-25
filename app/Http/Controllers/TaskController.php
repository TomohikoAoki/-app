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
        Task::create([
            'content' => $request['content'],
            'category_id' => $request['category_id'],
            'shop_id' => $request['shop_id'],
            'position_id' => $request['position_id'],
        ]);
    }

    public function editTask()
    {}

    public function deleteTask()
    {}

    public function indexTask()
    {}
}
