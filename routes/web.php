<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // 表單設計器路由
    Route::get('form-builder', function () {
        return Inertia::render('FormBuilder');
    })->name('form-builder');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
