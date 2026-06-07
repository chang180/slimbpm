<?php

namespace App\Support;

use App\Models\FormTemplate;
use App\Models\User;
use Illuminate\Support\Collection;

class FormTemplateMetadata
{
    /** @var list<string> */
    public const DEFAULT_CATEGORIES = [
        '申請表',
        '調查表',
        '回饋表',
        '聯絡表',
        '註冊表',
        '其他',
        '未分類',
    ];

    /**
     * @return array{categories: Collection<int, string>, suggestedTags: Collection<int, string>}
     */
    public static function forOrganization(int $organizationId): array
    {
        $orgUserIds = User::query()
            ->where('organization_id', $organizationId)
            ->pluck('id');

        $orgForms = FormTemplate::query()->whereIn('created_by', $orgUserIds);

        $existingCategories = $orgForms->clone()
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        $categories = collect(self::DEFAULT_CATEGORIES)
            ->merge($existingCategories)
            ->unique()
            ->sort()
            ->values();

        $suggestedTags = $orgForms->clone()
            ->pluck('tags')
            ->flatten()
            ->filter(fn ($tag) => is_string($tag) && $tag !== '')
            ->unique()
            ->sort()
            ->values();

        return [
            'categories' => $categories,
            'suggestedTags' => $suggestedTags,
        ];
    }
}
