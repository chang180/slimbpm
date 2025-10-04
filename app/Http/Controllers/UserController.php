<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use App\Models\OrganizationSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * 顯示用戶列表
     */
    public function index(Request $request)
    {
        $query = User::with(['organization', 'departments']);

        // 搜尋功能
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // 角色篩選
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        // 狀態篩選
        if ($request->has('status') && $request->status) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    /**
     * 顯示新增用戶頁面
     */
    public function create()
    {
        $departments = Department::where('is_active', true)->get();
        $organizations = OrganizationSetting::all();

        return Inertia::render('Users/Create', [
            'departments' => $departments,
            'organizations' => $organizations,
        ]);
    }

    /**
     * 儲存新用戶
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'organization_id' => 'nullable|exists:organization_settings,id',
            'role' => 'required|in:admin,manager,user',
            'is_active' => 'boolean',
            'departments' => 'nullable|array',
            'departments.*' => 'exists:departments,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'organization_id' => $validated['organization_id'] ?? null,
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // 關聯部門
        if (!empty($validated['departments'])) {
            $user->departments()->sync($validated['departments']);
        }

        return redirect()->route('web.users.index')
            ->with('success', '用戶建立成功！');
    }

    /**
     * 顯示用戶詳情
     */
    public function show(User $user)
    {
        $user->load(['organization', 'departments']);

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * 顯示編輯用戶頁面
     */
    public function edit(User $user)
    {
        $user->load(['organization', 'departments']);
        $departments = Department::where('is_active', true)->get();
        $organizations = OrganizationSetting::all();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'departments' => $departments,
            'organizations' => $organizations,
        ]);
    }

    /**
     * 更新用戶
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'organization_id' => 'nullable|exists:organization_settings,id',
            'role' => 'required|in:admin,manager,user',
            'is_active' => 'boolean',
            'departments' => 'nullable|array',
            'departments.*' => 'exists:departments,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'organization_id' => $validated['organization_id'] ?? null,
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? true,
        ];

        // 只有在提供新密碼時才更新密碼
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        // 更新部門關聯
        if (isset($validated['departments'])) {
            $user->departments()->sync($validated['departments']);
        }

        return redirect()->route('web.users.index')
            ->with('success', '用戶更新成功！');
    }

    /**
     * 刪除用戶
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('web.users.index')
            ->with('success', '用戶刪除成功！');
    }
}
