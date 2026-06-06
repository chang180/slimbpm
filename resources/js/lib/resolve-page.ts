import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ResolvedComponent } from '@inertiajs/react';

type PageModule = {
    default: ResolvedComponent;
};

const pages = import.meta.glob('../pages/**/*.tsx') as Record<
    string,
    () => Promise<PageModule>
>;

export async function resolvePage(name: string): Promise<ResolvedComponent> {
    const page = await resolvePageComponent<PageModule>(
        `../pages/${name}.tsx`,
        pages,
    );

    return page.default;
}
