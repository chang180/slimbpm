export interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
    page?: number | null;
}

/** Laravel LengthAwarePaginator shape as returned by Inertia. */
export interface LengthAwarePaginator<T> {
    data: T[];
    links: PaginatorLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export function hasMultiplePages(pagination: Pick<LengthAwarePaginator<unknown>, 'last_page'>): boolean {
    return pagination.last_page > 1;
}
