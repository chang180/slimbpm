<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();
                
                // 重新載入用戶以確保組織關係已載入
                $user->load('organization');
                
                // 獲取用戶所屬組織的 slug
                $slug = $user->organization?->slug;
                
                if (!$slug) {
                    // 如果用戶沒有組織，重定向到歡迎頁面
                    return redirect()->route('home');
                }
                
                // 重定向到用戶的儀表板
                return redirect()->route('dashboard', ['slug' => $slug]);
            }
        }

        return $next($request);
    }
}
