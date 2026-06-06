<?php

use App\Models\FormTemplate;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function makeOrgUser(string $role = 'user'): User
{
    $org = OrganizationSetting::factory()->create();

    return User::factory()->create([
        'organization_id' => $org->id,
        'role' => $role,
    ]);
}

it('renders the forms index page', function () {
    $user = makeOrgUser();

    $this->actingAs($user)
        ->get('/forms')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Forms/Index'));
});

it('renders the forms create page', function () {
    $user = makeOrgUser();

    $this->actingAs($user)
        ->get('/forms/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Forms/Create'));
});

it('renders the form show page', function () {
    $user = makeOrgUser();
    $form = FormTemplate::factory()->create(['created_by' => $user->id]);

    $this->actingAs($user)
        ->get("/forms/{$form->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Forms/Show')
            ->has('form')
            ->has('canEdit')
        );
});

it('renders the form edit page for the owner', function () {
    $user = makeOrgUser();
    $form = FormTemplate::factory()->create(['created_by' => $user->id]);

    $this->actingAs($user)
        ->get("/forms/{$form->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Forms/Edit')
            ->has('form')
        );
});

it('denies the form edit page for a non-owner', function () {
    $org = OrganizationSetting::factory()->create();
    $owner = User::factory()->create(['organization_id' => $org->id]);
    $other = User::factory()->create(['organization_id' => $org->id]);
    $form = FormTemplate::factory()->create(['created_by' => $owner->id]);

    $this->actingAs($other)
        ->get("/forms/{$form->id}/edit")
        ->assertForbidden();
});

it('renders the form submit page', function () {
    $user = makeOrgUser();
    $form = FormTemplate::factory()->create(['created_by' => $user->id]);

    $this->actingAs($user)
        ->get("/forms/{$form->id}/submit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Forms/Submit'));
});

it('renders the form results page for the owner', function () {
    $user = makeOrgUser();
    $form = FormTemplate::factory()->create(['created_by' => $user->id]);

    $this->actingAs($user)
        ->get("/forms/{$form->id}/results")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Forms/Results')
            ->has('form')
            ->has('submissions')
            ->has('statistics')
        );
});

it('denies the form results page for a non-owner', function () {
    $org = OrganizationSetting::factory()->create();
    $owner = User::factory()->create(['organization_id' => $org->id]);
    $other = User::factory()->create(['organization_id' => $org->id]);
    $form = FormTemplate::factory()->create(['created_by' => $owner->id]);

    $this->actingAs($other)
        ->get("/forms/{$form->id}/results")
        ->assertForbidden();
});
