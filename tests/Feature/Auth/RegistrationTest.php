<?php

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('registration screen can be rendered', function () {
    $response = $this->get(route('company.register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post(route('company.register'), [
        'company_name' => 'Test Company',
        'contact_person' => 'Test User',
        'contact_email' => 'test@example.com',
        'industry' => 'Technology',
        'admin_name' => 'Test Admin',
        'admin_email' => 'admin@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    // 註冊後會自動登入，並導向驗證頁面
    $this->assertAuthenticated();
    $response->assertRedirect(route('verification.notice'));
});
