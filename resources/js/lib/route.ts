/**
 * 簡單的路由函數，用於生成帶參數的路由 URL
 */
export function route(name: string, params: Record<string, string | number> = {}): string {
    // 路由映射
    const routes: Record<string, string> = {
        'company.register': '/register',
        'company.login': '/login/{slug}',
        'portal.login': '/portal/{slug}',
        'dashboard': '/dashboard/{slug}',
        'portal.home': '/portal/{slug}/home',
    };

    let url = routes[name];
    
    if (!url) {
        console.warn(`Route "${name}" not found`);
        return '#';
    }

    // 替換參數
    for (const [key, value] of Object.entries(params)) {
        url = url.replace(`{${key}}`, String(value));
    }

    return url;
}
