<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    /**
     * 顯示部門列表
     */
    public function index(Request $request): Response
    {
        $query = Department::query()
            ->with(['parent', 'children'])
            ->withCount('users');

        // 搜尋功能
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // 狀態篩選
        if ($request->has('status') && $request->status !== null) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // 如果沒有搜尋條件，只顯示頂層部門（用於樹狀結構）
        if (! $request->has('search') || ! $request->search) {
            $query->whereNull('parent_id');
        }

        $departments = $query->orderBy('name', 'asc')->get();

        return Inertia::render('Departments/Index', [
            'departments' => $departments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * 顯示新增部門頁面
     */
    public function create(): Response
    {
        $departments = Department::where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Departments/Create', [
            'departments' => $departments,
        ]);
    }

    /**
     * 儲存新部門
     */
    public function store(DepartmentRequest $request)
    {
        Department::create($request->validated());

        return redirect()->route('departments.index')
            ->with('success', '部門建立成功！');
    }

    /**
     * 顯示部門詳情
     */
    public function show(Department $department): Response
    {
        $department->load(['parent', 'children', 'users'])
            ->loadCount('users');

        return Inertia::render('Departments/Show', [
            'department' => $department,
        ]);
    }

    /**
     * 顯示編輯部門頁面
     */
    public function edit(Department $department): Response
    {
        $department->load(['parent', 'children']);

        // 獲取所有部門，但排除當前部門及其子部門（防止循環引用）
        $departments = Department::where('is_active', true)
            ->where('id', '!=', $department->id)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('name', 'asc')
            ->get();

        // 從部門列表中遞迴排除所有子部門
        $excludeIds = $this->getDescendantIds($department);
        $departments = $this->filterDepartments($departments, $excludeIds);

        return Inertia::render('Departments/Edit', [
            'department' => $department,
            'departments' => $departments,
        ]);
    }

    /**
     * 更新部門
     */
    public function update(DepartmentRequest $request, Department $department)
    {
        // 檢查是否會造成循環引用
        if ($request->parent_id) {
            $parentDepartment = Department::find($request->parent_id);
            if ($this->wouldCreateCircularReference($department, $parentDepartment)) {
                return redirect()->back()
                    ->withErrors(['parent_id' => '無法選擇子部門作為上級部門']);
            }
        }

        $department->update($request->validated());

        return redirect()->route('departments.index')
            ->with('success', '部門更新成功！');
    }

    /**
     * 刪除部門
     */
    public function destroy(Department $department)
    {
        // 檢查是否有子部門
        if ($department->children()->count() > 0) {
            return redirect()->back()
                ->withErrors(['department' => '此部門包含子部門，無法刪除']);
        }

        // 檢查是否有成員
        if ($department->users()->count() > 0) {
            return redirect()->back()
                ->withErrors(['department' => '此部門包含成員，無法刪除']);
        }

        $department->delete();

        return redirect()->route('departments.index')
            ->with('success', '部門刪除成功！');
    }

    /**
     * 獲取所有子部門 ID
     */
    private function getDescendantIds(Department $department): array
    {
        $ids = [$department->id];

        foreach ($department->children as $child) {
            $ids = array_merge($ids, $this->getDescendantIds($child));
        }

        return $ids;
    }

    /**
     * 過濾部門列表，排除指定 ID
     */
    private function filterDepartments($departments, array $excludeIds)
    {
        return $departments->filter(function ($dept) use ($excludeIds) {
            return ! in_array($dept->id, $excludeIds);
        })->map(function ($dept) use ($excludeIds) {
            if ($dept->children) {
                $dept->children = $this->filterDepartments($dept->children, $excludeIds);
            }

            return $dept;
        });
    }

    /**
     * 檢查是否會造成循環引用
     */
    private function wouldCreateCircularReference(Department $department, ?Department $newParent): bool
    {
        if (! $newParent) {
            return false;
        }

        if ($newParent->id === $department->id) {
            return true;
        }

        if ($newParent->parent_id === null) {
            return false;
        }

        return $this->wouldCreateCircularReference($department, $newParent->parent);
    }
}
