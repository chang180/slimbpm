<?php

namespace Database\Factories;

use App\Models\FormTemplate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FormTemplate>
 */
class FormTemplateFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FormTemplate::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'definition' => [
                'fields' => [
                    [
                        'id' => 'name',
                        'type' => 'text',
                        'label' => '姓名',
                        'required' => true,
                        'placeholder' => '請輸入您的姓名',
                        'position' => ['x' => 100, 'y' => 100],
                        'size' => ['width' => 200, 'height' => 40],
                        'validation' => [
                            'minLength' => 2,
                            'maxLength' => 50
                        ]
                    ],
                    [
                        'id' => 'email',
                        'type' => 'email',
                        'label' => '電子郵件',
                        'required' => true,
                        'placeholder' => '請輸入您的電子郵件',
                        'position' => ['x' => 100, 'y' => 160],
                        'size' => ['width' => 200, 'height' => 40]
                    ],
                    [
                        'id' => 'message',
                        'type' => 'textarea',
                        'label' => '訊息',
                        'required' => false,
                        'placeholder' => '請輸入您的訊息',
                        'position' => ['x' => 100, 'y' => 220],
                        'size' => ['width' => 200, 'height' => 100]
                    ]
                ],
                'layout' => [
                    'sections' => [
                        [
                            'id' => 'section_1',
                            'title' => '基本資訊',
                            'description' => '請填寫您的基本資訊',
                            'fields' => ['name', 'email'],
                            'order' => 1
                        ],
                        [
                            'id' => 'section_2',
                            'title' => '詳細資訊',
                            'description' => '請提供更多詳細資訊',
                            'fields' => ['message'],
                            'order' => 2
                        ]
                    ]
                ],
                'settings' => [
                    'allowMultipleSubmissions' => false,
                    'requireAuthentication' => false,
                    'showProgressBar' => true,
                    'autoSave' => false,
                    'submitButtonText' => '提交表單',
                    'successMessage' => '感謝您的提交！',
                    'redirectUrl' => null
                ],
                'theme' => [
                    'primaryColor' => '#3B82F6',
                    'backgroundColor' => '#FFFFFF',
                    'textColor' => '#1F2937',
                    'borderColor' => '#D1D5DB',
                    'borderRadius' => 8,
                    'fontFamily' => 'Inter, sans-serif'
                ]
            ],
            'category' => $this->faker->randomElement(['聯絡表單', '註冊表單', '調查表單', '申請表單', '其他']),
            'tags' => $this->faker->words(3),
            'is_public' => $this->faker->boolean(30),
            'created_by' => User::factory(),
        ];
    }

    /**
     * 公開表單
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => true,
        ]);
    }

    /**
     * 私人表單
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => false,
        ]);
    }

    /**
     * 特定分類的表單
     */
    public function category(string $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => $category,
        ]);
    }

    /**
     * 包含特定欄位類型的表單
     */
    public function withFieldType(string $fieldType): static
    {
        return $this->state(function (array $attributes) use ($fieldType) {
            $definition = $attributes['definition'];
            
            $newField = [
                'id' => 'custom_field',
                'type' => $fieldType,
                'label' => ucfirst($fieldType) . ' 欄位',
                'required' => false,
                'position' => ['x' => 100, 'y' => 300],
                'size' => ['width' => 200, 'height' => 40]
            ];
            
            if (in_array($fieldType, ['select', 'checkbox', 'radio'])) {
                $newField['options'] = [
                    ['value' => 'option1', 'label' => '選項 1'],
                    ['value' => 'option2', 'label' => '選項 2'],
                    ['value' => 'option3', 'label' => '選項 3']
                ];
            }
            
            $definition['fields'][] = $newField;
            
            return [
                'definition' => $definition,
            ];
        });
    }

    /**
     * 簡化的表單定義
     */
    public function simple(): static
    {
        return $this->state(fn (array $attributes) => [
            'definition' => [
                'fields' => [
                    [
                        'id' => 'name',
                        'type' => 'text',
                        'label' => '姓名',
                        'required' => true,
                        'position' => ['x' => 100, 'y' => 100],
                        'size' => ['width' => 200, 'height' => 40]
                    ]
                ],
                'layout' => [
                    'sections' => [
                        [
                            'id' => 'section_1',
                            'title' => '基本資訊',
                            'fields' => ['name'],
                            'order' => 1
                        ]
                    ]
                ],
                'settings' => [
                    'allowMultipleSubmissions' => false,
                    'requireAuthentication' => false,
                    'showProgressBar' => false,
                    'autoSave' => false,
                    'submitButtonText' => '提交',
                    'successMessage' => '提交成功！'
                ]
            ],
        ]);
    }
}