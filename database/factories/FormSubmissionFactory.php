<?php

namespace Database\Factories;

use App\Models\FormSubmission;
use App\Models\FormTemplate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FormSubmission>
 */
class FormSubmissionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FormSubmission::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'form_template_id' => FormTemplate::factory(),
            'data' => [
                'name' => $this->faker->name(),
                'email' => $this->faker->safeEmail(),
                'phone' => $this->faker->phoneNumber(),
                'message' => $this->faker->paragraph(),
                'age' => $this->faker->numberBetween(18, 80),
                'gender' => $this->faker->randomElement(['male', 'female', 'other']),
                'interests' => $this->faker->randomElements(['sports', 'music', 'travel', 'reading', 'cooking'], 2),
                'newsletter' => $this->faker->boolean(),
                'terms_accepted' => true,
                'submission_date' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
                'budget' => $this->faker->numberBetween(1000, 10000),
                'experience_level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
                'preferred_contact_method' => $this->faker->randomElement(['email', 'phone', 'sms']),
                'additional_comments' => $this->faker->optional(0.3)->paragraph(),
            ],
            'submitted_by' => User::factory(),
            'status' => $this->faker->randomElement(['draft', 'submitted', 'approved', 'rejected']),
            'submitted_at' => $this->faker->dateTimeThisYear(),
        ];
    }

    /**
     * 草稿狀態
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    /**
     * 已提交狀態
     */
    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'submitted',
        ]);
    }

    /**
     * 已核准狀態
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    /**
     * 已拒絕狀態
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
        ]);
    }

    /**
     * 簡化的提交資料
     */
    public function simple(): static
    {
        return $this->state(fn (array $attributes) => [
            'data' => [
                'name' => $this->faker->name(),
                'email' => $this->faker->safeEmail(),
                'message' => $this->faker->sentence(),
            ],
        ]);
    }

    /**
     * 聯絡表單提交
     */
    public function contactForm(): static
    {
        return $this->state(fn (array $attributes) => [
            'data' => [
                'name' => $this->faker->name(),
                'email' => $this->faker->safeEmail(),
                'phone' => $this->faker->phoneNumber(),
                'subject' => $this->faker->sentence(4),
                'message' => $this->faker->paragraph(),
                'inquiry_type' => $this->faker->randomElement(['general', 'support', 'sales', 'partnership']),
                'urgency' => $this->faker->randomElement(['low', 'medium', 'high']),
                'preferred_contact_time' => $this->faker->randomElement(['morning', 'afternoon', 'evening']),
            ],
        ]);
    }

    /**
     * 註冊表單提交
     */
    public function registrationForm(): static
    {
        return $this->state(fn (array $attributes) => [
            'data' => [
                'first_name' => $this->faker->firstName(),
                'last_name' => $this->faker->lastName(),
                'email' => $this->faker->safeEmail(),
                'phone' => $this->faker->phoneNumber(),
                'date_of_birth' => $this->faker->date('Y-m-d', '-18 years'),
                'gender' => $this->faker->randomElement(['male', 'female', 'other']),
                'address' => $this->faker->address(),
                'city' => $this->faker->city(),
                'postal_code' => $this->faker->postcode(),
                'country' => $this->faker->country(),
                'occupation' => $this->faker->jobTitle(),
                'company' => $this->faker->company(),
                'interests' => $this->faker->randomElements(['technology', 'business', 'education', 'health', 'entertainment'], 3),
                'newsletter_subscription' => $this->faker->boolean(),
                'terms_and_conditions' => true,
                'privacy_policy' => true,
            ],
        ]);
    }

    /**
     * 調查表單提交
     */
    public function surveyForm(): static
    {
        return $this->state(fn (array $attributes) => [
            'data' => [
                'age_range' => $this->faker->randomElement(['18-25', '26-35', '36-45', '46-55', '55+']),
                'gender' => $this->faker->randomElement(['male', 'female', 'other']),
                'education_level' => $this->faker->randomElement(['high_school', 'bachelor', 'master', 'phd']),
                'employment_status' => $this->faker->randomElement(['employed', 'unemployed', 'student', 'retired']),
                'income_range' => $this->faker->randomElement(['0-25k', '25k-50k', '50k-75k', '75k-100k', '100k+']),
                'satisfaction_rating' => $this->faker->numberBetween(1, 5),
                'recommendation_likelihood' => $this->faker->numberBetween(1, 10),
                'improvement_suggestions' => $this->faker->optional(0.7)->paragraph(),
                'additional_feedback' => $this->faker->optional(0.5)->paragraph(),
                'contact_for_followup' => $this->faker->boolean(),
            ],
        ]);
    }
}