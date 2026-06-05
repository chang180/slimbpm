<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvitationStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()?->role, ['admin', 'manager']);
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'emails' => ['required', 'array', 'min:1', 'max:20'],
            'emails.*' => ['required', 'email', 'max:255'],
            'role' => ['required', 'string', 'in:admin,manager,user'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'emails.required' => '請至少填寫一個電子郵件地址',
            'emails.*.email' => '電子郵件格式不正確',
            'role.required' => '請選擇角色',
            'role.in' => '角色必須為 admin、manager 或 user',
        ];
    }
}
