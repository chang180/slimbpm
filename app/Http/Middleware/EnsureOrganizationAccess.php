<?php

namespace App\Http\Middleware;

use App\Models\OrganizationSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 獲取當前用戶
        $user = $request->user();

        if (! $user) {
            return redirect()->route('home');
        }

        // 從 URL 中獲取 slug
        $slug = $request->route('slug');

        if (! $slug) {
            // 如果沒有 slug，嘗試從用戶的組織獲取
            if ($user->organization) {
                return redirect()->route('dashboard', ['slug' => $user->organization->slug]);
            }

            return redirect()->route('home');
        }

        // 驗證 slug 對應的組織是否存在
        $organization = OrganizationSetting::where('slug', $slug)->first();

        if (! $organization) {
            abort(404, '找不到該企業');
        }

        // 檢查用戶是否屬於該組織
        if ($user->organization_id !== $organization->id) {
            abort(403, '您沒有權限訪問該企業的系統');
        }

        // 將組織資訊添加到請求中，方便後續使用
        $request->merge(['current_organization' => $organization]);

        // 設定全域變數，方便在視圖中使用
        view()->share('current_organization', $organization);

        return $next($request);
    }
}
