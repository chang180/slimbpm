<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrganizationRequest;
use App\Models\OrganizationSetting;
use Illuminate\Http\JsonResponse;

class OrganizationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $organizations = OrganizationSetting::query()
            ->withCount('users')
            ->latest()
            ->get();

        return response()->json([
            'data' => $organizations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrganizationRequest $request): JsonResponse
    {
        $organization = OrganizationSetting::create($request->validated());

        return response()->json([
            'message' => 'Organization created successfully.',
            'data' => $organization,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(OrganizationSetting $organization): JsonResponse
    {
        $organization->loadCount('users');

        return response()->json([
            'data' => $organization,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(OrganizationRequest $request, OrganizationSetting $organization): JsonResponse
    {
        $organization->update($request->validated());

        return response()->json([
            'message' => 'Organization updated successfully.',
            'data' => $organization,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrganizationSetting $organization): JsonResponse
    {
        $organization->delete();

        return response()->json([
            'message' => 'Organization deleted successfully.',
        ]);
    }
}
