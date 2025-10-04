<?php

use App\Models\User;
use App\Models\FormTemplate;
use App\Models\FormSubmission;

test('can create form template', function () {
    $user = User::factory()->create();
    
    $formData = [
        'name' => '測試表單',
        'description' => '這是一個測試表單',
        'definition' => [
            'fields' => [
                [
                    'id' => 'name',
                    'type' => 'text',
                    'label' => '姓名',
                    'required' => true,
                    'position' => ['x' => 100, 'y' => 100]
                ]
            ],
            'layout' => ['sections' => []],
            'settings' => [
                'allowMultipleSubmissions' => false,
                'requireAuthentication' => false,
                'showProgressBar' => true,
                'autoSave' => false,
                'submitButtonText' => '提交',
                'successMessage' => '表單提交成功！'
            ],
            'version' => '1.0.0'
        ],
        'category' => '測試',
        'tags' => ['測試', '表單'],
        'is_public' => false
    ];
    
    $response = $this->actingAs($user)
        ->postJson('/api/v1/forms', $formData);
    
    $response->assertStatus(201)
        ->assertJsonStructure([
            'id',
            'name',
            'description',
            'definition',
            'category',
            'tags',
            'is_public',
            'created_by',
            'creator'
        ]);
    
    $this->assertDatabaseHas('form_templates', [
        'name' => '測試表單',
        'created_by' => $user->id
    ]);
});

test('can get form template list', function () {
    $user = User::factory()->create();
    $form = FormTemplate::factory()->create(['created_by' => $user->id]);
    
    $response = $this->actingAs($user)
        ->getJson('/api/v1/forms');
    
    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'description',
                    'category',
                    'is_public',
                    'creator'
                ]
            ]
        ]);
});

test('can get specific form template', function () {
    $user = User::factory()->create();
    $form = FormTemplate::factory()->create(['created_by' => $user->id]);
    
    $response = $this->actingAs($user)
        ->getJson("/api/v1/forms/{$form->id}");
    
    $response->assertStatus(200)
        ->assertJson([
            'id' => $form->id,
            'name' => $form->name
        ]);
});

test('can update form template', function () {
    $user = User::factory()->create();
    $form = FormTemplate::factory()->create(['created_by' => $user->id]);
    
    $updateData = [
        'name' => '更新後的表單名稱',
        'description' => '更新後的描述'
    ];
    
    $response = $this->actingAs($user)
        ->putJson("/api/v1/forms/{$form->id}", $updateData);
    
    $response->assertStatus(200)
        ->assertJson([
            'name' => '更新後的表單名稱',
            'description' => '更新後的描述'
        ]);
    
    $this->assertDatabaseHas('form_templates', [
        'id' => $form->id,
        'name' => '更新後的表單名稱'
    ]);
});

test('can delete form template', function () {
    $user = User::factory()->create();
    $form = FormTemplate::factory()->create(['created_by' => $user->id]);
    
    $response = $this->actingAs($user)
        ->deleteJson("/api/v1/forms/{$form->id}");
    
    $response->assertStatus(200)
        ->assertJson(['message' => '表單已刪除']);
    
    $this->assertDatabaseMissing('form_templates', [
        'id' => $form->id
    ]);
});

test('can duplicate form template', function () {
    $user = User::factory()->create();
    $form = FormTemplate::factory()->create(['created_by' => $user->id]);
    
    $response = $this->actingAs($user)
        ->postJson("/api/v1/forms/{$form->id}/duplicate");
    
    $response->assertStatus(201)
        ->assertJsonStructure([
            'id',
            'name',
            'description',
            'definition',
            'created_by'
        ]);
    
    $this->assertDatabaseHas('form_templates', [
        'name' => $form->name . ' (複製)',
        'created_by' => $user->id
    ]);
});

test('can submit form data', function () {
    $user = User::factory()->create();
    $form = FormTemplate::factory()->create([
        'created_by' => $user->id,
        'definition' => [
            'fields' => [
                [
                    'id' => 'name',
                    'type' => 'text',
                    'label' => '姓名',
                    'required' => true
                ],
                [
                    'id' => 'email',
                    'type' => 'email',
                    'label' => '電子郵件',
                    'required' => true
                ]
            ]
        ]
    ]);
    
    $submissionData = [
        'name' => '測試使用者',
        'email' => 'test@example.com'
    ];
    
    $response = $this->actingAs($user)
        ->postJson("/api/v1/forms/{$form->id}/submit", $submissionData);
    
    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'submission_id'
        ]);
    
    $this->assertDatabaseHas('form_submissions', [
        'form_template_id' => $form->id,
        'submitted_by' => $user->id,
        'status' => 'submitted'
    ]);
});

test('can get form submissions', function () {
    $user = User::factory()->create();
    $form = FormTemplate::factory()->create(['created_by' => $user->id]);
    $submission = FormSubmission::factory()->create([
        'form_template_id' => $form->id,
        'submitted_by' => $user->id
    ]);
    
    $response = $this->actingAs($user)
        ->getJson("/api/v1/forms/{$form->id}/submissions");
    
    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'form_template_id',
                    'data',
                    'status',
                    'submitter'
                ]
            ]
        ]);
});

test('cannot update form template created by other user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $form = FormTemplate::factory()->create(['created_by' => $otherUser->id]);
    
    $updateData = [
        'name' => '嘗試更新'
    ];
    
    $response = $this->actingAs($user)
        ->putJson("/api/v1/forms/{$form->id}", $updateData);
    
    $response->assertStatus(403)
        ->assertJson(['message' => '無權限修改此表單']);
});

test('cannot delete form template created by other user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $form = FormTemplate::factory()->create(['created_by' => $otherUser->id]);
    
    $response = $this->actingAs($user)
        ->deleteJson("/api/v1/forms/{$form->id}");
    
    $response->assertStatus(403)
        ->assertJson(['message' => '無權限刪除此表單']);
});

test('form validation works correctly', function () {
    $user = User::factory()->create();
    $form = FormTemplate::factory()->create([
        'created_by' => $user->id,
        'definition' => [
            'fields' => [
                [
                    'id' => 'email',
                    'type' => 'email',
                    'label' => '電子郵件',
                    'required' => true
                ],
                [
                    'id' => 'age',
                    'type' => 'number',
                    'label' => '年齡',
                    'required' => true,
                    'validation' => [
                        'min' => 18,
                        'max' => 100
                    ]
                ]
            ]
        ]
    ]);
    
    // 測試無效的電子郵件
    $response = $this->actingAs($user)
        ->postJson("/api/v1/forms/{$form->id}/submit", [
            'email' => 'invalid-email',
            'age' => 25
        ]);
    
    $response->assertStatus(422);
    
    // 測試年齡超出範圍
    $response = $this->actingAs($user)
        ->postJson("/api/v1/forms/{$form->id}/submit", [
            'email' => 'test@example.com',
            'age' => 150
        ]);
    
    $response->assertStatus(422);
    
    // 測試有效的提交
    $response = $this->actingAs($user)
        ->postJson("/api/v1/forms/{$form->id}/submit", [
            'email' => 'test@example.com',
            'age' => 25
        ]);
    
    $response->assertStatus(201);
});