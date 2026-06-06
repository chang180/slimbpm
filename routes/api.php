<?php

use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\FormSubmissionController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\NotificationSettingController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WorkflowController;
use App\Http\Controllers\Api\WorkflowInstanceController;
use App\Http\Controllers\Api\WorkflowStepController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth')->get('/user', function (Request $request) {
    return $request->user();
});

// API v1 Routes
Route::prefix('v1')->middleware('auth')->group(function () {
    // Organization Management
    Route::apiResource('organizations', OrganizationController::class)->names([
        'index' => 'api.organizations.index',
        'store' => 'api.organizations.store',
        'show' => 'api.organizations.show',
        'update' => 'api.organizations.update',
        'destroy' => 'api.organizations.destroy',
    ]);

    // Department Management
    Route::apiResource('departments', DepartmentController::class)->names([
        'index' => 'api.departments.index',
        'store' => 'api.departments.store',
        'show' => 'api.departments.show',
        'update' => 'api.departments.update',
        'destroy' => 'api.departments.destroy',
    ]);

    // User Management
    Route::apiResource('users', UserController::class)->names([
        'index' => 'api.users.index',
        'store' => 'api.users.store',
        'show' => 'api.users.show',
        'update' => 'api.users.update',
        'destroy' => 'api.users.destroy',
    ]);

    // Workflow Management
    Route::apiResource('workflows', WorkflowController::class)->names([
        'index' => 'api.workflows.index',
        'store' => 'api.workflows.store',
        'show' => 'api.workflows.show',
        'update' => 'api.workflows.update',
        'destroy' => 'api.workflows.destroy',
    ]);
    Route::post('workflows/{workflow}/duplicate', [WorkflowController::class, 'duplicate'])->name('api.workflows.duplicate');
    Route::get('workflows/{workflow}/export', [WorkflowController::class, 'export'])->name('api.workflows.export');
    Route::post('workflows/import', [WorkflowController::class, 'import'])->name('api.workflows.import');
    Route::apiResource('workflow-instances', WorkflowInstanceController::class)->names([
        'index' => 'api.workflow-instances.index',
        'store' => 'api.workflow-instances.store',
        'show' => 'api.workflow-instances.show',
        'update' => 'api.workflow-instances.update',
        'destroy' => 'api.workflow-instances.destroy',
    ]);
    Route::patch('workflow-instances/{workflow_instance}/steps/{step}', [WorkflowStepController::class, 'update'])->name('api.workflow-instances.steps.update');

    // Form Management
    Route::apiResource('forms', FormController::class)->names([
        'index' => 'api.forms.index',
        'store' => 'api.forms.store',
        'show' => 'api.forms.show',
        'update' => 'api.forms.update',
        'destroy' => 'api.forms.destroy',
    ]);
    Route::post('forms/{form}/duplicate', [FormController::class, 'duplicate']);
    Route::post('forms/{form}/submit', [FormController::class, 'submit']);
    Route::get('forms/{form}/submissions', [FormController::class, 'submissions']);
    Route::apiResource('form-submissions', FormSubmissionController::class);

    // Notification Management
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
    Route::apiResource('notifications', NotificationController::class);
    Route::post('notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::apiResource('notification-settings', NotificationSettingController::class);
    Route::post('notification-settings/reset', [NotificationSettingController::class, 'reset']);

    // Invitation Management
    Route::get('invitations', [InvitationController::class, 'index'])->name('api.invitations.index');
    Route::post('invitations', [InvitationController::class, 'store'])->name('api.invitations.store');
    Route::delete('invitations/{invitation}', [InvitationController::class, 'destroy'])->name('api.invitations.destroy');
    Route::post('invitations/{invitation}/resend', [InvitationController::class, 'resend'])->name('api.invitations.resend');
});
