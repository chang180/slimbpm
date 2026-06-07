import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CUSTOM_CATEGORY_VALUE } from '@/lib/form-template';
import { useMemo, useState } from 'react';

export interface FormMetadataValues {
    category: string;
    tags: string[];
}

interface FormMetadataFieldsProps {
    categories: string[];
    suggestedTags: string[];
    values: FormMetadataValues;
    onChange: (values: FormMetadataValues) => void;
}

export function FormMetadataFields({ categories, suggestedTags, values, onChange }: FormMetadataFieldsProps) {
    const [tagInput, setTagInput] = useState('');
    const [useCustomCategory, setUseCustomCategory] = useState(
        () => values.category !== '' && !categories.includes(values.category),
    );

    const categorySelectValue = useMemo(() => {
        if (useCustomCategory) {
            return CUSTOM_CATEGORY_VALUE;
        }

        return categories.includes(values.category) ? values.category : values.category || '未分類';
    }, [categories, useCustomCategory, values.category]);

    const availableSuggestedTags = suggestedTags.filter((tag) => !values.tags.includes(tag));

    const addTag = (tag: string) => {
        const trimmed = tag.trim();

        if (!trimmed || values.tags.includes(trimmed)) {
            return;
        }

        onChange({ ...values, tags: [...values.tags, trimmed] });
        setTagInput('');
    };

    const removeTag = (tagToRemove: string) => {
        onChange({ ...values, tags: values.tags.filter((tag) => tag !== tagToRemove) });
    };

    return (
        <>
            <div>
                <Label htmlFor="category">分類</Label>
                <Select
                    value={categorySelectValue}
                    onValueChange={(value) => {
                        if (value === CUSTOM_CATEGORY_VALUE) {
                            setUseCustomCategory(true);
                            onChange({ ...values, category: values.category || '' });

                            return;
                        }

                        setUseCustomCategory(false);
                        onChange({ ...values, category: value });
                    }}
                >
                    <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="選擇分類" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                        <SelectItem value={CUSTOM_CATEGORY_VALUE}>自訂分類…</SelectItem>
                    </SelectContent>
                </Select>
                {useCustomCategory && (
                    <Input
                        type="text"
                        placeholder="輸入自訂分類名稱"
                        value={values.category}
                        onChange={(e) => onChange({ ...values, category: e.target.value })}
                        className="mt-2"
                    />
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="tag-input">標籤</Label>
                <div className="flex gap-2">
                    <Input
                        id="tag-input"
                        type="text"
                        placeholder="輸入標籤名稱"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag(tagInput);
                            }
                        }}
                        className="flex-1"
                    />
                    <Button type="button" onClick={() => addTag(tagInput)} variant="outline">
                        新增
                    </Button>
                </div>

                {availableSuggestedTags.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">組織內已有標籤（點擊加入）</p>
                        <div className="flex flex-wrap gap-2">
                            {availableSuggestedTags.map((tag) => (
                                <Button
                                    key={tag}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => addTag(tag)}
                                >
                                    + {tag}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {values.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {values.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 text-gray-500 hover:text-gray-700"
                                    aria-label={`移除標籤 ${tag}`}
                                >
                                    ×
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
