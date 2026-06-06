import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

/**
 * 取得目前組織 slug，供儀表板等需 `/dashboard/{slug}` 的連結使用。
 */
export function useSlug(): string | null {
    const { auth } = usePage<SharedData>().props;

    const organizationSlug = auth?.user?.organization?.slug;
    if (organizationSlug) {
        return organizationSlug;
    }

    const dashboardMatch = window.location.pathname.match(/\/dashboard\/([^/]+)/);

    return dashboardMatch?.[1] ?? null;
}
