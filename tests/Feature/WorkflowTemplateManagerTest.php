<?php

use App\Models\User;
use App\Models\WorkflowTemplate;
use App\Services\Workflow\WorkflowTemplateManager;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->manager = new WorkflowTemplateManager();
});

test('it can get default templates', function () {
    $defaults = $this->manager->defaults();
    
    expect($defaults)->toBeInstanceOf(\Illuminate\Support\Collection::class);
    expect($defaults->count())->toBeGreaterThan(0);
    
    $firstTemplate = $defaults->first();
    expect($firstTemplate)->toHaveKeys(['key', 'name', 'description', 'category', 'definition']);
});

test('it can clone a workflow template', function () {
    $user = User::factory()->create();
    $original = WorkflowTemplate::factory()->create(['created_by' => $user->id]);
    
    $cloned = $this->manager->cloneTemplate($original, [
        'name' => 'Cloned Template',
        'description' => 'This is a cloned template',
    ], $user);
    
    expect($cloned)->toBeInstanceOf(WorkflowTemplate::class);
    expect($cloned->name)->toBe('Cloned Template');
    expect($cloned->description)->toBe('This is a cloned template');
    expect($cloned->definition)->toBe($original->definition);
    expect($cloned->created_by)->toBe($user->id);
    expect($cloned->is_current)->toBeTrue();
});

test('it can import a workflow template', function () {
    $user = User::factory()->create();
    
    $payload = [
        'name' => 'Imported Template',
        'description' => 'This is an imported template',
        'definition' => [
            'nodes' => [
                [
                    'id' => 'start-1',
                    'type' => 'start',
                    'data' => ['label' => 'Start'],
                    'position' => ['x' => 0, 'y' => 0],
                ],
                [
                    'id' => 'end-1',
                    'type' => 'end',
                    'data' => ['label' => 'End'],
                    'position' => ['x' => 240, 'y' => 0],
                ],
            ],
            'edges' => [
                [
                    'id' => 'edge-1',
                    'source' => 'start-1',
                    'target' => 'end-1',
                    'data' => [],
                ],
            ],
        ],
    ];
    
    $imported = $this->manager->importTemplate($payload, $user);
    
    expect($imported)->toBeInstanceOf(WorkflowTemplate::class);
    expect($imported->name)->toBe('Imported Template');
    expect($imported->description)->toBe('This is an imported template');
    expect($imported->definition)->toBe($payload['definition']);
    expect($imported->created_by)->toBe($user->id);
    expect($imported->is_current)->toBeTrue();
});

test('it can export a workflow template', function () {
    $template = WorkflowTemplate::factory()->create();
    
    $exported = $this->manager->exportTemplate($template);
    
    expect($exported)->toBeArray();
    expect($exported)->toHaveKeys(['name', 'description', 'version', 'is_active', 'definition']);
    expect($exported['name'])->toBe($template->name);
    expect($exported['description'])->toBe($template->description);
    expect($exported['version'])->toBe($template->version);
    expect($exported['is_active'])->toBe((bool) $template->is_active);
    expect($exported['definition'])->toBe($template->definition);
});

test('it can create a new version of a workflow template', function () {
    $user = User::factory()->create();
    $original = WorkflowTemplate::factory()->create([
        'version' => '1.2.3',
        'created_by' => $user->id,
    ]);
    
    $newVersion = $this->manager->createNewVersion($original, [
        'name' => 'Updated Template',
        'description' => 'Updated description',
    ], $user);
    
    expect($newVersion)->toBeInstanceOf(WorkflowTemplate::class);
    expect($newVersion->name)->toBe('Updated Template');
    expect($newVersion->description)->toBe('Updated description');
    expect($newVersion->version)->toBe('1.2.4');
    expect($newVersion->parent_id)->toBe($original->id);
    expect($newVersion->is_current)->toBeTrue();
    expect($newVersion->created_by)->toBe($user->id);
});

test('it can get version history of a workflow template', function () {
    $user = User::factory()->create();
    $original = WorkflowTemplate::factory()->create(['created_by' => $user->id]);
    
    // Create some versions
    $version1 = WorkflowTemplate::factory()->create([
        'parent_id' => $original->id,
        'version' => '1.1.0',
        'created_by' => $user->id,
    ]);
    
    $version2 = WorkflowTemplate::factory()->create([
        'parent_id' => $original->id,
        'version' => '1.2.0',
        'created_by' => $user->id,
    ]);
    
    $history = $this->manager->getVersionHistory($original);
    
    expect($history)->toBeInstanceOf(\Illuminate\Support\Collection::class);
    expect($history->count())->toBe(3); // original + 2 versions
    expect($history->pluck('version')->toArray())->toContain('1.0.0', '1.1.0', '1.2.0');
});

test('it can set current version of a workflow template', function () {
    $user = User::factory()->create();
    $original = WorkflowTemplate::factory()->create([
        'is_current' => true,
        'created_by' => $user->id,
    ]);
    
    $version1 = WorkflowTemplate::factory()->create([
        'parent_id' => $original->id,
        'version' => '1.1.0',
        'is_current' => false,
        'created_by' => $user->id,
    ]);
    
    // Set version1 as current
    $this->manager->setCurrentVersion($version1);
    
    expect($original->fresh()->is_current)->toBeFalse();
    expect($version1->fresh()->is_current)->toBeTrue();
});

test('it throws exception when importing template with invalid definition', function () {
    $user = User::factory()->create();
    
    $payload = [
        'name' => 'Invalid Template',
        'description' => 'This template has invalid definition',
        'definition' => [
            'nodes' => 'invalid', // Should be array
        ],
    ];
    
    expect(fn () => $this->manager->importTemplate($payload, $user))
        ->toThrow(\InvalidArgumentException::class, 'Workflow definition must include nodes.');
});

test('it throws exception when importing template without edges', function () {
    $user = User::factory()->create();
    
    $payload = [
        'name' => 'Invalid Template',
        'description' => 'This template has no edges',
        'definition' => [
            'nodes' => [
                [
                    'id' => 'start-1',
                    'type' => 'start',
                    'data' => ['label' => 'Start'],
                    'position' => ['x' => 0, 'y' => 0],
                ],
            ],
            // Missing edges
        ],
    ];
    
    expect(fn () => $this->manager->importTemplate($payload, $user))
        ->toThrow(\InvalidArgumentException::class, 'Workflow definition must include edges.');
});