<?php

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API v1 Routes
Route::prefix('v1')->middleware('auth')->group(function () {
    // Organization Management
    Route::apiResource('organizations', App\Http\Controllers\Api\OrganizationController::class);
    
    // Department Management
    Route::apiResource('departments', App\Http\Controllers\Api\DepartmentController::class);
    
    // Workflow Management
    Route::apiResource('workflows', App\Http\Controllers\Api\WorkflowController::class);
    
    // Form Management
    Route::apiResource('forms', App\Http\Controllers\Api\FormController::class);
    Route::post('forms/{form}/duplicate', [App\Http\Controllers\Api\FormController::class, 'duplicate']);
    Route::post('forms/{form}/submit', [App\Http\Controllers\Api\FormController::class, 'submit']);
    Route::get('forms/{form}/submissions', [App\Http\Controllers\Api\FormController::class, 'submissions']);
    // Route::apiResource('form-submissions', App\Http\Controllers\Api\FormSubmissionController::class);
    
    // Notification Management
    // Route::apiResource('notifications', App\Http\Controllers\Api\NotificationController::class);
    // Route::apiResource('notification-settings', App\Http\Controllers\Api\NotificationSettingController::class);
});
