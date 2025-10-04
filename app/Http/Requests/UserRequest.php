<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user') ? $this->route('user')->id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,'.$userId],
            'password' => [$this->isMethod('POST') ? 'required' : 'nullable', 'string', 'min:8'],
            'organization_id' => ['nullable', 'exists:organization_settings,id'],
            'role' => ['required', 'in:admin,manager,user'],
            'is_active' => ['boolean'],
            'departments' => ['nullable', 'array'],
            'departments.*' => ['exists:departments,id'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'User name is required.',
            'name.string' => 'User name must be a string.',
            'name.max' => 'User name cannot exceed 255 characters.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'Email has already been taken.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'organization_id.exists' => 'The selected organization does not exist.',
            'role.required' => 'Role is required.',
            'role.in' => 'Role must be one of: admin, manager, user.',
            'is_active.boolean' => 'Active status must be true or false.',
            'departments.array' => 'Departments must be an array.',
            'departments.*.exists' => 'One or more selected departments do not exist.',
        ];
    }
}
