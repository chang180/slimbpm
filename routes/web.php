<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    
    // 表單設計器路由
    Route::get('form-builder', function () {
        return Inertia::render('FormBuilder');
    })->name('form-builder');

    // 部門管理路由
    Route::resource('departments', App\Http\Controllers\DepartmentController::class);

    // 報表路由
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [App\Http\Controllers\ReportsController::class, 'index'])->name('index');
        Route::get('/user-activity', [App\Http\Controllers\ReportsController::class, 'userActivity'])->name('user-activity');
        Route::get('/workflow-performance', [App\Http\Controllers\ReportsController::class, 'workflowPerformance'])->name('workflow-performance');
        Route::get('/system-stats', [App\Http\Controllers\ReportsController::class, 'systemStats'])->name('system-stats');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
