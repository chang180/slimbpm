<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Fortify重導向路由
Route::get('/dashboard-redirect', function () {
    $user = auth()->user();

    if (! $user) {
        return redirect()->route('home');
    }

    // 重新從資料庫取得用戶資料以確保有最新的 organization_id
    $user = \App\Models\User::find($user->id);

    if ($user && $user->organization_id) {
        $organization = \App\Models\OrganizationSetting::find($user->organization_id);
        if ($organization) {
            return redirect(route('dashboard', ['slug' => $organization->slug]));
        }
    }

    return redirect()->route('home');
})->middleware('auth')->name('dashboard.redirect');

// 企業註冊路由
Route::get('/register', [App\Http\Controllers\Auth\CompanyRegistrationController::class, 'create'])->name('company.register');
Route::post('/register', [App\Http\Controllers\Auth\CompanyRegistrationController::class, 'store']);

// 企業後台登入路由
Route::get('/login/{slug}', [App\Http\Controllers\Auth\CompanyLoginController::class, 'create'])->name('company.login');
Route::post('/login/{slug}', [App\Http\Controllers\Auth\CompanyLoginController::class, 'store']);

// 企業前台登入路由
Route::get('/portal/{slug}', [App\Http\Controllers\Auth\CompanyLoginController::class, 'createPortal'])->name('portal.login');
Route::post('/portal/{slug}', [App\Http\Controllers\Auth\CompanyLoginController::class, 'storePortal']);

Route::middleware(['auth', 'verified', 'org.access'])->group(function () {
    Route::get('dashboard/{slug}', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // 表單相關路由
    Route::prefix('forms')->name('forms.')->group(function () {
        Route::get('/', [App\Http\Controllers\FormController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\FormController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\FormController::class, 'store'])->name('store');
        Route::get('/{form}', [App\Http\Controllers\FormController::class, 'show'])->name('show');
        Route::get('/{form}/edit', [App\Http\Controllers\FormController::class, 'edit'])->name('edit');
        Route::put('/{form}', [App\Http\Controllers\FormController::class, 'update'])->name('update');
        Route::delete('/{form}', [App\Http\Controllers\FormController::class, 'destroy'])->name('destroy');
        Route::get('/{form}/submit', [App\Http\Controllers\FormController::class, 'submit'])->name('submit');
        Route::post('/{form}/submit', [App\Http\Controllers\FormController::class, 'processSubmit'])->name('process-submit');
        Route::get('/{form}/results', [App\Http\Controllers\FormController::class, 'results'])->name('results');
        Route::post('/{form}/duplicate', [App\Http\Controllers\FormController::class, 'duplicate'])->name('duplicate');
    });

    // 表單設計器路由
    Route::get('form-builder', function () {
        return Inertia::render('FormBuilder');
    })->name('form-builder');

    // 組織管理路由
    Route::prefix('organization')->name('organization.')->group(function () {
        Route::get('/', [App\Http\Controllers\OrganizationController::class, 'index'])->name('index');
        Route::get('/settings', [App\Http\Controllers\OrganizationController::class, 'settings'])->name('settings');
        Route::put('/settings', [App\Http\Controllers\OrganizationController::class, 'updateSettings'])->name('settings.update');
        Route::get('/info', [App\Http\Controllers\OrganizationController::class, 'info'])->name('info');
        Route::get('/preferences', [App\Http\Controllers\OrganizationController::class, 'preferences'])->name('preferences');
        Route::put('/preferences', [App\Http\Controllers\OrganizationController::class, 'updatePreferences'])->name('preferences.update');
        Route::get('/reports', [App\Http\Controllers\OrganizationController::class, 'reports'])->name('reports');
    });

    // 用戶管理路由
    Route::resource('users', App\Http\Controllers\UserController::class, [
        'names' => [
            'index' => 'web.users.index',
            'create' => 'web.users.create',
            'store' => 'web.users.store',
            'show' => 'web.users.show',
            'edit' => 'web.users.edit',
            'update' => 'web.users.update',
            'destroy' => 'web.users.destroy',
        ],
    ]);

    // 部門管理路由
    Route::resource('departments', App\Http\Controllers\DepartmentController::class);

    // 報表路由
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [App\Http\Controllers\ReportsController::class, 'index'])->name('index');
        Route::get('/user-activity', [App\Http\Controllers\ReportsController::class, 'userActivity'])->name('user-activity');
        Route::get('/workflow-performance', [App\Http\Controllers\ReportsController::class, 'workflowPerformance'])->name('workflow-performance');
        Route::get('/system-stats', [App\Http\Controllers\ReportsController::class, 'systemStats'])->name('system-stats');

        // 匯出路由
        Route::post('/export/user-activity', [App\Http\Controllers\ReportsController::class, 'exportUserActivity'])->name('export.user-activity');
        Route::post('/export/system-stats', [App\Http\Controllers\ReportsController::class, 'exportSystemStats'])->name('export.system-stats');
        Route::post('/export/workflow-performance', [App\Http\Controllers\ReportsController::class, 'exportWorkflowPerformance'])->name('export.workflow-performance');
    });

    // 工作流程設計器路由
    Route::get('workflows/designer', function () {
        return Inertia::render('workflows/designer', [
            'workflow' => null,
            'canEdit' => true,
        ]);
    })->name('workflows.designer');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
