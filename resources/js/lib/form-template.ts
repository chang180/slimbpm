import { type FormDefinition, type FormSettings } from '@/types/FormTypes';

/** Creator relation loaded from FormController. */
export interface FormTemplateCreator {
    id: number;
    name: string;
}

export interface FormTemplateListItem {
    id: number;
    name: string;
    description: string | null;
    category: string;
    tags: string[];
    is_public: boolean;
    created_at: string;
    updated_at: string;
    created_by: number;
    creator_name?: string | null;
    creator?: FormTemplateCreator | null;
}

export function formatFormDate(dateString: string | null | undefined): string {
    if (!dateString) {
        return '—';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formCreatorName(form: {
    creator_name?: string | null;
    creator?: FormTemplateCreator | null;
    created_by?: number;
}): string {
    const name = form.creator_name?.trim() || form.creator?.name?.trim();

    if (name) {
        return name;
    }

    if (form.created_by) {
        return `用戶 #${form.created_by}`;
    }

    return '未知';
}

export const CUSTOM_CATEGORY_VALUE = '__custom__';

const defaultFormSettings = (): FormSettings => ({
    allowMultipleSubmissions: true,
    requireAuthentication: false,
    showProgressBar: true,
    autoSave: true,
    submitButtonText: '提交',
    successMessage: '表單提交成功！',
});

export function formDefinitionFromTemplate(form: {
    name: string;
    description?: string | null;
    definition: FormDefinition;
}): FormDefinition {
    const definition = form.definition;

    return {
        ...definition,
        name: definition.name || form.name,
        description: definition.description ?? form.description ?? '',
        fields: definition.fields ?? [],
        layout: definition.layout ?? { sections: [] },
        settings: definition.settings ?? defaultFormSettings(),
        version: definition.version ?? '1.0.0',
    };
}
