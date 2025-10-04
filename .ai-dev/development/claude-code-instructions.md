# Claude Code 開發指示檔案

## 🎯 開發任務：Phase 2 - 用戶管理系統

### 當前狀態
- **分支**: `feature/user-management`
- **Linear Issue**: DEV-37 - Phase 2: 用戶管理系統
- **開發者**: Claude Code
- **開始時間**: 2025年10月4日

## 📋 開發任務清單

### 1. 組織架構 CRUD 功能
- [ ] 建立 OrganizationSettingController
- [ ] 實作組織設定的 CRUD 操作
- [ ] 建立組織設定的 API 端點
- [ ] 新增組織設定的表單驗證

### 2. 部門管理 (可選功能)
- [ ] 建立 DepartmentController
- [ ] 實作部門的 CRUD 操作
- [ ] 支援層級部門結構
- [ ] 部門管理介面

### 3. 角色權限管理
- [ ] 建立權限驗證中間件
- [ ] 實作角色檢查邏輯
- [ ] 部門主管權限設定
- [ ] 權限繼承機制

### 4. 用戶管理介面
- [ ] 建立 UserController
- [ ] 實作用戶管理 CRUD
- [ ] 用戶部門關聯管理
- [ ] 用戶角色指派

### 5. 權限驗證中間件
- [ ] 建立 PermissionMiddleware
- [ ] 實作權限檢查邏輯
- [ ] 角色驗證機制
- [ ] 部門權限驗證

## 🏗️ 技術實作指南

### 1. Controller 實作
```php
// app/Http/Controllers/Api/OrganizationController.php
class OrganizationController extends Controller
{
    public function index()
    public function store(Request $request)
    public function show(OrganizationSetting $organization)
    public function update(Request $request, OrganizationSetting $organization)
    public function destroy(OrganizationSetting $organization)
}
```

### 2. 表單驗證
```php
// app/Http/Requests/OrganizationRequest.php
class OrganizationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'settings' => 'nullable|array',
        ];
    }
}
```

### 3. 權限中間件
```php
// app/Http/Middleware/PermissionMiddleware.php
class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, string $permission)
    {
        // 實作權限檢查邏輯
    }
}
```

### 4. API 路由設定
```php
// routes/api.php
Route::middleware(['auth:sanctum', 'permission:admin'])->group(function () {
    Route::apiResource('organizations', OrganizationController::class);
    Route::apiResource('departments', DepartmentController::class);
});
```

## 📊 資料庫結構參考

### 已建立的資料表
- `organization_settings` - 組織設定
- `departments` - 部門管理
- `user_departments` - 用戶部門關聯
- `users` - 用戶表 (已擴展)

### 關聯關係
```php
// OrganizationSetting
public function users(): HasMany

// Department  
public function parent(): BelongsTo
public function children(): HasMany
public function users(): BelongsToMany

// User
public function organization(): BelongsTo
public function departments(): BelongsToMany
```

## 🧪 測試要求

### 1. 建立測試檔案
```bash
php artisan make:test --pest OrganizationManagementTest
php artisan make:test --pest DepartmentManagementTest
php artisan make:test --pest UserManagementTest
php artisan make:test --pest PermissionTest
```

### 2. 測試案例
- 組織設定 CRUD 測試
- 部門管理測試
- 用戶權限測試
- API 端點測試

### 3. 測試執行
```bash
php artisan test --filter=OrganizationManagement
php artisan test --filter=DepartmentManagement
php artisan test --filter=UserManagement
php artisan test --filter=Permission
```

## 🔧 開發環境設定

### 1. 確認環境
```bash
# 確認 Laravel 版本
php artisan --version

# 確認資料庫連線
php artisan migrate:status

# 確認測試環境
php artisan test
```

### 2. 程式碼格式化
```bash
# 執行程式碼格式化
vendor/bin/pint --dirty

# 檢查程式碼品質
php artisan test --coverage
```

## 📝 開發流程

### 1. 每日開發流程
1. 拉取最新主分支更新
2. 檢查 Linear Issue 狀態
3. 實作當日任務
4. 執行測試確保品質
5. 提交變動並推送到分支

### 2. 提交規範
```bash
# 提交格式
git commit -m "feat: Add organization management CRUD functionality

- Implement OrganizationController with full CRUD operations
- Add organization validation rules
- Create organization management tests
- Update API routes for organization endpoints

Closes DEV-37"
```

### 3. 進度更新
- 每日更新 Linear Issue 進度
- 更新開發文件
- 記錄遇到的問題和解決方案

## 🚨 注意事項

### 1. 權限設計
- 系統管理員 (admin) 擁有所有權限
- 部門主管 (manager) 管理所屬部門
- 一般用戶 (user) 基本權限

### 2. 資料驗證
- 所有輸入必須經過驗證
- 使用 Form Request 類別
- 實作適當的錯誤處理

### 3. 效能考量
- 使用 Eloquent 關聯避免 N+1 問題
- 適當的資料庫索引
- 快取常用資料

## 📞 支援資源

### 1. 文件參考
- Laravel 12 官方文件
- Eloquent 關聯文件
- API 資源文件

### 2. 現有程式碼
- 查看 `app/Models/` 中的 Model 關聯
- 參考 `database/migrations/` 中的資料表結構
- 查看 `tests/Feature/` 中的測試案例

### 3. 問題回報
- 遇到問題時記錄在 Linear Issue 中
- 提供詳細的錯誤訊息和重現步驟
- 包含相關的程式碼片段

## 🎯 完成標準

### 1. 功能完成
- [ ] 所有 CRUD 操作正常運作
- [ ] 權限驗證機制完整
- [ ] API 端點測試通過
- [ ] 用戶介面功能正常

### 2. 程式碼品質
- [ ] 程式碼通過 Lint 檢查
- [ ] 測試覆蓋率達到要求
- [ ] 程式碼文件完整
- [ ] 無明顯的效能問題

### 3. 文件更新
- [ ] API 文件更新
- [ ] 開發文件更新
- [ ] 測試文件更新
- [ ] 部署文件更新

---
**開始開發時間**: 2025年10月4日  
**預估完成時間**: 2025年10月11日 (1週)  
**負責 AI**: Claude Code  
**Linear Issue**: DEV-37
