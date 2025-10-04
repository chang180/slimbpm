<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $users = User::query()
            ->with(['organization', 'departments'])
            ->latest()
            ->get();

        return response()->json([
            'data' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request): JsonResponse
    {
        $data = $request->validated();
        $departments = $data['departments'] ?? [];
        unset($data['departments']);

        $user = User::create($data);

        if (! empty($departments)) {
            $user->departments()->sync($departments);
        }

        $user->load(['organization', 'departments']);

        return response()->json([
            'message' => 'User created successfully.',
            'data' => $user,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): JsonResponse
    {
        $user->load(['organization', 'departments']);

        return response()->json([
            'data' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();
        $departments = $data['departments'] ?? null;
        unset($data['departments']);

        // Remove password if not provided
        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        if ($departments !== null) {
            $user->departments()->sync($departments);
        }

        $user->load(['organization', 'departments']);

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }
}
