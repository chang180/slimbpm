<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormTemplate;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class FormController extends Controller
{
    /**
     * 取得表單模板列表
     */
    public function index(Request $request): JsonResponse
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
        
        return response()->json($forms);
    }

    /**
     * 建立新的表單模板
     */
    public function store(Request $request): JsonResponse
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
        
        return response()->json($form->load('creator'), 201);
    }

    /**
     * 取得特定表單模板
     */
    public function show(FormTemplate $form): JsonResponse
    {
        return response()->json($form->load('creator'));
    }

    /**
     * 更新表單模板
     */
    public function update(Request $request, FormTemplate $form): JsonResponse
    {
        // 檢查權限
        if ($form->created_by !== Auth::id()) {
            return response()->json(['message' => '無權限修改此表單'], 403);
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
        
        return response()->json($form->load('creator'));
    }

    /**
     * 刪除表單模板
     */
    public function destroy(FormTemplate $form): JsonResponse
    {
        // 檢查權限
        if ($form->created_by !== Auth::id()) {
            return response()->json(['message' => '無權限刪除此表單'], 403);
        }
        
        $form->delete();
        
        return response()->json(['message' => '表單已刪除']);
    }

    /**
     * 複製表單模板
     */
    public function duplicate(FormTemplate $form): JsonResponse
    {
        $newForm = $form->replicate();
        $newForm->name = $form->name . ' (複製)';
        $newForm->created_by = Auth::id();
        $newForm->is_public = false;
        $newForm->save();
        
        return response()->json($newForm->load('creator'), 201);
    }

    /**
     * 提交表單資料
     */
    public function submit(Request $request, FormTemplate $form): JsonResponse
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
        
        return response()->json([
            'message' => '表單提交成功',
            'submission_id' => $submission->id
        ], 201);
    }

    /**
     * 取得表單提交記錄
     */
    public function submissions(FormTemplate $form): JsonResponse
    {
        // 檢查權限
        if ($form->created_by !== Auth::id()) {
            return response()->json(['message' => '無權限查看此表單的提交記錄'], 403);
        }
        
        $submissions = $form->submissions()
            ->with('submitter')
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return response()->json($submissions);
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
