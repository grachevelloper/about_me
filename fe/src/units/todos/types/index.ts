import {LikedEntity} from '@/typings/common';

export interface Todo extends LikedEntity {
    title: string;
    content: string;
    priority: TodoPriority;
    state: TodoState;
    checklist?: string[];
    authorId: string;
}

export enum TodoPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    SUPER = 'super',
}

export enum TodoState {
    IN_WORK = 'in_work',
    PLANNING = 'planning',
    FINISHED = 'finished',
    CANCELED = 'canceled',
}

export type EditValue = 'state' | 'priority';
