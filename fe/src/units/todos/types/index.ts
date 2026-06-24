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
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    SUPER = 'Super',
}

export enum TodoState {
    IN_WORK = 'In_work',
    PLANNING = 'Planning',
    FINISHED = 'Finished',
    CANCELED = 'Canceled',
}
