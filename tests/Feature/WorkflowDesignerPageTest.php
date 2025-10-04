<?php

use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Inertia\Testing\AssertableInertia as Assert;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('workflow designer page requires authentication', function () {
    $this->get(route('workflows.designer'))
        ->assertRedirect(route('login'));
});

test('workflow designer page requires verified email when enabled', function () {
    if (! in_array(MustVerifyEmail::class, class_implements(User::class), true)) {
        $this->markTestSkipped('Email verification is not enforced for the user model.');
    }

    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $this->actingAs($user)
        ->get(route('workflows.designer'))
        ->assertRedirect(route('verification.notice'));
});

test('workflow designer page renders for authenticated users', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('workflows.designer'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workflows/designer')
            ->where('workflow', null)
            ->where('canEdit', true)
        );
});
