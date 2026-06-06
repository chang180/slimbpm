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

/** Laravel paginator labels are HTML (`&laquo; Previous`); render as plain 繁中. */
export function formatPaginationLabel(label: string): string {
    const normalized = label
        .replace(/&laquo;/gi, '«')
        .replace(/&raquo;/gi, '»')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]+>/g, '')
        .trim();

    if (/previous|上一頁/i.test(normalized) || normalized.startsWith('«')) {
        return '上一頁';
    }

    if (/next|下一頁/i.test(normalized) || normalized.endsWith('»')) {
        return '下一頁';
    }

    return normalized;
}
