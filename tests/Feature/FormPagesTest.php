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

it('includes creator name on the forms index', function () {
    $user = makeOrgUser();
    $user->update(['name' => '表單作者']);
    FormTemplate::factory()->create(['created_by' => $user->id]);

    $this->actingAs($user)
        ->get('/forms')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('forms.data.0.creator_name', '表單作者')
            ->where('forms.data.0.creator.name', '表單作者')
        );
});

it('renders the forms index page', function () {
    $user = makeOrgUser();

    $this->actingAs($user)
        ->get('/forms')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Forms/Index')
            ->has('forms.data')
            ->where('forms.last_page', 1)
            ->where('forms.total', 0)
        );
});

it('renders the forms create page', function () {
    $user = makeOrgUser();

    $this->actingAs($user)
        ->get('/forms/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Forms/Create')
            ->has('categories')
            ->has('suggestedTags')
        );
});

it('stores a public form with tags and category', function () {
    $user = makeOrgUser();

    $payload = [
        'name' => '公開測試表單',
        'description' => '描述',
        'category' => '申請表',
        'tags' => ['人事', '急件'],
        'is_public' => true,
        'definition' => [
            'fields' => [],
            'layout' => ['sections' => []],
            'settings' => [
                'submitButtonText' => '提交',
                'successMessage' => '成功',
            ],
            'version' => '1.0.0',
        ],
    ];

    $this->actingAs($user)
        ->post(route('forms.store'), $payload)
        ->assertRedirect();

    $form = FormTemplate::query()->firstOrFail();

    expect($form->is_public)->toBeTrue()
        ->and($form->category)->toBe('申請表')
        ->and($form->tags)->toBe(['人事', '急件']);
});

it('renders the form show page with persisted metadata', function () {
    $user = makeOrgUser();
    $form = FormTemplate::factory()->create([
        'created_by' => $user->id,
        'is_public' => true,
        'category' => '調查表',
        'tags' => ['客戶'],
    ]);

    $this->actingAs($user)
        ->get("/forms/{$form->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Forms/Show')
            ->where('form.is_public', true)
            ->where('form.category', '調查表')
            ->has('form.created_at')
            ->has('form.updated_at')
        );
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
            ->has('categories')
            ->has('suggestedTags')
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

it('renders the form design page for the owner', function () {
    $user = makeOrgUser();
    $form = FormTemplate::factory()->simple()->create(['created_by' => $user->id]);

    $this->actingAs($user)
        ->get("/forms/{$form->id}/design")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Forms/Design')
            ->has('form')
            ->where('form.id', $form->id)
        );
});

it('denies the form design page for a non-owner', function () {
    $org = OrganizationSetting::factory()->create();
    $owner = User::factory()->create(['organization_id' => $org->id]);
    $other = User::factory()->create(['organization_id' => $org->id]);
    $form = FormTemplate::factory()->create(['created_by' => $owner->id]);

    $this->actingAs($other)
        ->get("/forms/{$form->id}/design")
        ->assertForbidden();
});

it('persists field definition updates from the design page', function () {
    $user = makeOrgUser();
    $form = FormTemplate::factory()->create([
        'created_by' => $user->id,
        'definition' => [
            'fields' => [],
            'layout' => ['sections' => []],
            'settings' => [
                'allowMultipleSubmissions' => false,
                'requireAuthentication' => false,
                'showProgressBar' => true,
                'autoSave' => false,
                'submitButtonText' => '提交',
                'successMessage' => '成功',
            ],
            'version' => '1.0.0',
        ],
    ]);

    $definition = [
        'fields' => [
            [
                'id' => 'company',
                'type' => 'text',
                'label' => '公司名稱',
                'required' => true,
                'position' => ['x' => 100, 'y' => 100],
                'size' => ['width' => 200, 'height' => 40],
            ],
        ],
        'layout' => [
            'sections' => [
                [
                    'id' => 'main',
                    'title' => '主要區段',
                    'fields' => ['company'],
                    'order' => 1,
                ],
            ],
        ],
        'settings' => [
            'allowMultipleSubmissions' => false,
            'requireAuthentication' => false,
            'showProgressBar' => true,
            'autoSave' => false,
            'submitButtonText' => '送出',
            'successMessage' => '已收到',
        ],
        'version' => '1.0.0',
    ];

    $this->actingAs($user)
        ->put(route('forms.update', $form), [
            'name' => '更新後表單',
            'description' => '新描述',
            'definition' => $definition,
        ])
        ->assertRedirect(route('forms.show', $form));

    $form->refresh();

    expect($form->name)->toBe('更新後表單')
        ->and($form->description)->toBe('新描述')
        ->and($form->definition['fields'])->toHaveCount(1)
        ->and($form->definition['fields'][0]['label'])->toBe('公司名稱');
});
