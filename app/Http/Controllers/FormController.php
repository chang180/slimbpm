<?php

namespace App\Http\Controllers;

use App\Models\FormTemplate;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FormController extends Controller
{
    /**
     * 顯示表單列表
     */
    public function index(Request $request): Response
    {
        $query = FormTemplate::with('creator');
        
        // 搜尋功能
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        // 分類篩選
        if ($request->has('category')) {
            $query->where('category', $request->get('category'));
        }
        
        // 公開/私人篩選
        if ($request->has('is_public')) {
            $query->where('is_public', $request->boolean('is_public'));
        }
        
        $forms = $query->orderBy('updated_at', 'desc')->paginate(20);
        
        // 取得所有分類
        $categories = FormTemplate::distinct()->pluck('category')->filter()->sort()->values();
        
        return Inertia::render('Forms/Index', [
            'forms' => $forms,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'is_public'])
        ]);
    }

    /**
     * 顯示創建表單頁面
     */
    public function create(): Response
    {
        return Inertia::render('Forms/Create');
    }

    /**
     * 儲存新表單
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'definition' => 'required|array',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'is_public' => 'boolean',
        ]);
        
        $form = FormTemplate::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'definition' => $validated['definition'],
            'category' => $validated['category'] ?? '未分類',
            'tags' => $validated['tags'] ?? [],
            'is_public' => $validated['is_public'] ?? false,
            'created_by' => Auth::id(),
        ]);
        
        return redirect()->route('forms.show', $form)
            ->with('success', '表單創建成功');
    }

    /**
     * 顯示特定表單
     */
    public function show(FormTemplate $form): Response
    {
        $form->load('creator');
        
        return Inertia::render('Forms/Show', [
            'form' => $form,
            'canEdit' => $form->created_by === Auth::id(),
        ]);
    }

    /**
     * 顯示編輯表單頁面
     */
    public function edit(FormTemplate $form): Response
    {
        // 檢查權限
        if ($form->created_by !== Auth::id()) {
            abort(403, '無權限修改此表單');
        }
        
        $form->load('creator');
        
        return Inertia::render('Forms/Edit', [
            'form' => $form,
        ]);
    }

    /**
     * 更新表單
     */
    public function update(Request $request, FormTemplate $form)
    {
        // 檢查權限
        if ($form->created_by !== Auth::id()) {
            abort(403, '無權限修改此表單');
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'definition' => 'sometimes|array',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'is_public' => 'boolean',
        ]);
        
        $form->update($validated);
        
        return redirect()->route('forms.show', $form)
            ->with('success', '表單更新成功');
    }

    /**
     * 刪除表單
     */
    public function destroy(FormTemplate $form)
    {
        // 檢查權限
        if ($form->created_by !== Auth::id()) {
            abort(403, '無權限刪除此表單');
        }
        
        $form->delete();
        
        return redirect()->route('forms.index')
            ->with('success', '表單已刪除');
    }

    /**
     * 顯示表單提交頁面
     */
    public function submit(FormTemplate $form): Response
    {
        return Inertia::render('Forms/Submit', [
            'form' => $form,
        ]);
    }

    /**
     * 處理表單提交
     */
    public function processSubmit(Request $request, FormTemplate $form)
    {
        // 驗證表單資料
        $validationRules = $this->buildValidationRules($form->definition);
        $validated = $request->validate($validationRules);
        
        // 建立表單提交記錄
        $submission = FormSubmission::create([
            'form_template_id' => $form->id,
            'data' => $validated,
            'submitted_by' => Auth::id(),
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
        
        return redirect()->route('forms.submit', $form)
            ->with('success', '表單提交成功');
    }

    /**
     * 顯示表單結果頁面
     */
    public function results(FormTemplate $form): Response
    {
        // 檢查權限
        if ($form->created_by !== Auth::id()) {
            abort(403, '無權限查看此表單的提交記錄');
        }
        
        $submissions = $form->submissions()
            ->with('submitter')
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        // 計算統計資料
        $statistics = [
            'total_submissions' => $submissions->total(),
            'submissions_today' => $form->submissions()->whereDate('created_at', today())->count(),
            'submissions_this_week' => $form->submissions()->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'submissions_this_month' => $form->submissions()->whereMonth('created_at', now()->month)->count(),
        ];
        
        return Inertia::render('Forms/Results', [
            'form' => $form,
            'submissions' => $submissions,
            'statistics' => $statistics,
        ]);
    }

    /**
     * 複製表單
     */
    public function duplicate(FormTemplate $form)
    {
        $newForm = $form->replicate();
        $newForm->name = $form->name . ' (複製)';
        $newForm->created_by = Auth::id();
        $newForm->is_public = false;
        $newForm->save();
        
        return redirect()->route('forms.show', $newForm)
            ->with('success', '表單複製成功');
    }

    /**
     * 根據表單定義建立驗證規則
     */
    private function buildValidationRules(array $definition): array
    {
        $rules = [];
        
        if (!isset($definition['fields'])) {
            return $rules;
        }
        
        foreach ($definition['fields'] as $field) {
            $fieldRules = [];
            
            // 必填驗證
            if ($field['required'] ?? false) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }
            
            // 類型驗證
            switch ($field['type']) {
                case 'email':
                    $fieldRules[] = 'email';
                    break;
                case 'number':
                    $fieldRules[] = 'numeric';
                    break;
                case 'date':
                    $fieldRules[] = 'date';
                    break;
                case 'url':
                    $fieldRules[] = 'url';
                    break;
            }
            
            // 長度驗證
            if (isset($field['validation']['minLength'])) {
                $fieldRules[] = 'min:' . $field['validation']['minLength'];
            }
            if (isset($field['validation']['maxLength'])) {
                $fieldRules[] = 'max:' . $field['validation']['maxLength'];
            }
            
            // 數值範圍驗證
            if (isset($field['validation']['min'])) {
                $fieldRules[] = 'min:' . $field['validation']['min'];
            }
            if (isset($field['validation']['max'])) {
                $fieldRules[] = 'max:' . $field['validation']['max'];
            }
            
            // 正則表達式驗證
            if (isset($field['validation']['pattern'])) {
                $fieldRules[] = 'regex:' . $field['validation']['pattern'];
            }
            
            $rules[$field['id']] = $fieldRules;
        }
        
        return $rules;
    }
}
