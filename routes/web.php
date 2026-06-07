<?php

use App\Http\Controllers\Auth\CompanyLoginController;
use App\Http\Controllers\Auth\CompanyRegistrationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\InvitationManagementController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkflowInstanceController;
use App\Http\Controllers\WorkflowMonitorController;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'auth' => [
            'user' => auth()->user() ? [
                'id' => auth()->user()->id,
                'name' => auth()->user()->name,
                'email' => auth()->user()->email,
                'organization' => auth()->user()->organization ? [
                    'id' => auth()->user()->organization->id,
                    'name' => auth()->user()->organization->name,
                    'slug' => auth()->user()->organization->slug,
                ] : null,
            ] : null,
        ],
    ]);
})->name('home');

// Fortify重導向路由
Route::get('/dashboard-redirect', function () {
    $user = auth()->user();

    if (! $user) {
        return redirect()->route('home');
    }

    // 重新從資料庫取得用戶資料以確保有最新的 organization_id
    $user = User::find($user->id);

    if ($user && $user->organization_id) {
        $organization = OrganizationSetting::find($user->organization_id);
        if ($organization) {
            return redirect(route('dashboard', ['slug' => $organization->slug]));
        }
    }

    return redirect()->route('home');
})->middleware('auth')->name('dashboard.redirect');

// 企業註冊路由
Route::get('/register', [CompanyRegistrationController::class, 'create'])->name('company.register');
Route::post('/register', [CompanyRegistrationController::class, 'store']);

// 企業後台登入路由
Route::get('/login/{slug}', [CompanyLoginController::class, 'create'])->name('company.login');
Route::post('/login/{slug}', [CompanyLoginController::class, 'store']);

// 企業前台登入路由
Route::get('/portal/{slug}', [CompanyLoginController::class, 'createPortal'])->name('portal.login');
Route::post('/portal/{slug}', [CompanyLoginController::class, 'storePortal']);

// 邀請接受路由
Route::get('/invitations/accept/{token}', [InvitationController::class, 'accept'])->name('invitations.accept');
Route::post('/invitations/accept/{token}', [InvitationController::class, 'store'])->name('invitations.store');
Route::post('/invitations/login/{token}', [InvitationController::class, 'login'])->name('invitations.login');

Route::middleware(['auth', 'verified', 'org.access'])->group(function () {
    Route::get('dashboard/{slug}', [DashboardController::class, 'index'])->name('dashboard');

    // 表單相關路由
    Route::prefix('forms')->name('forms.')->group(function () {
        Route::get('/', [FormController::class, 'index'])->name('index');
        Route::get('/create', [FormController::class, 'create'])->name('create');
        Route::post('/', [FormController::class, 'store'])->name('store');
        Route::get('/{form}', [FormController::class, 'show'])->name('show');
        Route::get('/{form}/design', [FormController::class, 'design'])->name('design');
        Route::get('/{form}/edit', [FormController::class, 'edit'])->name('edit');
        Route::put('/{form}', [FormController::class, 'update'])->name('update');
        Route::delete('/{form}', [FormController::class, 'destroy'])->name('destroy');
        Route::get('/{form}/submit', [FormController::class, 'submit'])->name('submit');
        Route::post('/{form}/submit', [FormController::class, 'processSubmit'])->name('process-submit');
        Route::get('/{form}/results', [FormController::class, 'results'])->name('results');
        Route::post('/{form}/duplicate', [FormController::class, 'duplicate'])->name('duplicate');
    });

    // 表單設計器路由
    Route::get('form-builder', function () {
        return Inertia::render('FormBuilder');
    })->name('form-builder');

    // 組織管理路由
    Route::prefix('organization')->name('organization.')->group(function () {
        Route::get('/', [OrganizationController::class, 'index'])->name('index');
        Route::get('/settings', [OrganizationController::class, 'settings'])->name('settings');
        Route::put('/settings', [OrganizationController::class, 'updateSettings'])->name('settings.update');
        Route::get('/info', [OrganizationController::class, 'info'])->name('info');
        Route::get('/preferences', [OrganizationController::class, 'preferences'])->name('preferences');
        Route::put('/preferences', [OrganizationController::class, 'updatePreferences'])->name('preferences.update');
        Route::get('/reports', [OrganizationController::class, 'reports'])->name('reports');
    });

    // 用戶管理路由
    Route::resource('users', UserController::class, [
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
    Route::resource('departments', DepartmentController::class);

    // 報表路由
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportsController::class, 'index'])->name('index');
        Route::get('/user-activity', [ReportsController::class, 'userActivity'])->name('user-activity');
        Route::get('/workflow-performance', [ReportsController::class, 'workflowPerformance'])->name('workflow-performance');
        Route::get('/system-stats', [ReportsController::class, 'systemStats'])->name('system-stats');
        Route::get('/department-analysis', [ReportsController::class, 'departmentAnalysis'])->name('department-analysis');

        // 匯出路由
        Route::post('/export/user-activity', [ReportsController::class, 'exportUserActivity'])->name('export.user-activity');
        Route::post('/export/system-stats', [ReportsController::class, 'exportSystemStats'])->name('export.system-stats');
        Route::post('/export/workflow-performance', [ReportsController::class, 'exportWorkflowPerformance'])->name('export.workflow-performance');
    });

    // 通知中心路由
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

    // 邀請管理路由（管理員用）
    Route::get('/invitations', [InvitationManagementController::class, 'index'])->name('invitations.index');

    // 工作流程執行路由
    Route::prefix('workflows')->name('workflows.')->group(function () {
        Route::get('/', [WorkflowInstanceController::class, 'index'])->name('index');
        Route::get('/start', [WorkflowInstanceController::class, 'create'])->name('start');
        Route::get('/monitor', [WorkflowMonitorController::class, 'index'])->name('monitor');
        Route::get('/designer', function () {
            return Inertia::render('workflows/designer', [
                'workflow' => null,
                'canEdit' => true,
            ]);
        })->name('designer');
        Route::get('/{workflowInstance}', [WorkflowInstanceController::class, 'show'])->name('show');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
