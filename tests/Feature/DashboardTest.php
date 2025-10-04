<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    // 測試訪問需要 slug 的 dashboard 路由
    $this->get('/dashboard/test-slug')->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $organization = \App\Models\OrganizationSetting::factory()->create();
    $user = User::factory()->create(['organization_id' => $organization->id]);

    $this->actingAs($user);

    $this->get(route('dashboard', ['slug' => $organization->slug]))->assertOk();
});
