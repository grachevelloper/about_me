import {Todo} from '@/todos/types';

export interface BaseDetail<T> {
    content?: T;
    isPending?: boolean;
    onEnd: <K extends UpdateField>(newValueType: K, newValue: Todo[K]) => void;
    onChange?: () => void;
}

export type UpdateField = keyof Pick<
    Todo,
    'checklist' | 'content' | 'state' | 'priority' | 'title'
>;
