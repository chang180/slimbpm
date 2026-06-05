<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvitationResendRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()?->role, ['admin', 'manager']);
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [];
    }
}
