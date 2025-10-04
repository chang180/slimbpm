import { usePage } from '@inertiajs/react';

/**
 * 從當前路由中獲取 slug 參數
 */
export function useSlug(): string | null {
    const page = usePage();
    
    // 從 URL 中提取 slug
    const url = window.location.pathname;
    const slugMatch = url.match(/\/([^\/]+)\/?$/);
    
    // 檢查是否是有效的 UUID 格式的 slug
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const potentialSlug = slugMatch?.[1];
    
    if (potentialSlug && uuidRegex.test(potentialSlug)) {
        return potentialSlug;
    }
    
    return null;
}
