<?php

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('email verification screen can be rendered', function () {
    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get(route('verification.notice'));

    $response->assertStatus(200);
});

test('email can be verified', function () {
    $organization = \App\Models\OrganizationSetting::factory()->create();
    $user = User::factory()->unverified()->create(['organization_id' => $organization->id]);

    Event::fake();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    Event::assertDispatched(Verified::class);
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    $response->assertRedirect(route('dashboard', ['slug' => $organization->slug]).'?verified=1');
});

test('email is not verified with invalid hash', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1('wrong-email')]
    );

    $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('email is not verified with invalid user id', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => 123, 'hash' => sha1($user->email)]
    );

    $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('verified user is redirected to dashboard from verification prompt', function () {
    $organization = \App\Models\OrganizationSetting::factory()->create();
    $user = User::factory()->create([
        'email_verified_at' => now(),
        'organization_id' => $organization->id,
    ]);

    $response = $this->actingAs($user)->get(route('verification.notice'));

    // 檢查重導向鏈
    $response->assertRedirect();

    // 跟隨重導向
    $redirectResponse = $this->get($response->headers->get('Location'));
    $redirectResponse->assertRedirect(route('dashboard', ['slug' => $organization->slug]));
});

test('already verified user visiting verification link is redirected without firing event again', function () {
    $organization = \App\Models\OrganizationSetting::factory()->create();
    $user = User::factory()->create([
        'email_verified_at' => now(),
        'organization_id' => $organization->id,
    ]);

    Event::fake();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $this->actingAs($user)->get($verificationUrl)
        ->assertRedirect(route('dashboard', ['slug' => $organization->slug]).'?verified=1');

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    Event::assertNotDispatched(Verified::class);
});
