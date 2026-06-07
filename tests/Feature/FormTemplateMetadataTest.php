<?php

use App\Models\FormTemplate;
use App\Models\OrganizationSetting;
use App\Models\User;
use App\Support\FormTemplateMetadata;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('merges default categories with organization form categories', function () {
    $org = OrganizationSetting::factory()->create();
    $user = User::factory()->create(['organization_id' => $org->id]);

    FormTemplate::factory()->create([
        'created_by' => $user->id,
        'category' => '自訂分類',
        'tags' => ['標籤A', '標籤B'],
    ]);

    FormTemplate::factory()->create([
        'created_by' => $user->id,
        'category' => '申請表',
        'tags' => ['標籤B', '標籤C'],
    ]);

    $metadata = FormTemplateMetadata::forOrganization($org->id);

    expect($metadata['categories']->contains('自訂分類'))->toBeTrue()
        ->and($metadata['categories']->contains('申請表'))->toBeTrue()
        ->and($metadata['suggestedTags']->all())->toEqual(['標籤A', '標籤B', '標籤C']);
});

it('does not leak categories or tags from other organizations', function () {
    $orgA = OrganizationSetting::factory()->create();
    $orgB = OrganizationSetting::factory()->create();
    $userB = User::factory()->create(['organization_id' => $orgB->id]);

    FormTemplate::factory()->create([
        'created_by' => $userB->id,
        'category' => 'B 組織專用',
        'tags' => ['B-標籤'],
    ]);

    $metadata = FormTemplateMetadata::forOrganization($orgA->id);

    expect($metadata['categories']->contains('B 組織專用'))->toBeFalse()
        ->and($metadata['suggestedTags']->contains('B-標籤'))->toBeFalse();
});
