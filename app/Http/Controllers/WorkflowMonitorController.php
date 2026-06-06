<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WorkflowInstance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WorkflowMonitorController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        if (! in_array($user->role, ['admin', 'manager'])) {
            abort(403);
        }

        $organization = $request->get('current_organization');
        $orgUserIds = User::where('organization_id', $organization->id)->pluck('id');

        $query = WorkflowInstance::with(['template', 'starter'])
            ->whereIn('started_by', $orgUserIds)
            ->orderByDesc('updated_at');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%"));
        }

        $instances = $query->paginate(20)->withQueryString();

        $statsBase = WorkflowInstance::whereIn('started_by', $orgUserIds);

        $stats = [
            'total' => (clone $statsBase)->count(),
            'running' => (clone $statsBase)->where('status', 'running')->count(),
            'completed' => (clone $statsBase)->where('status', 'completed')->count(),
            'suspended' => (clone $statsBase)->where('status', 'suspended')->count(),
            'cancelled' => (clone $statsBase)->where('status', 'cancelled')->count(),
        ];

        return Inertia::render('workflows/Monitor', [
            'instances' => $instances,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }
}
