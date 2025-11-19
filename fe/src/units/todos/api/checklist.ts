import {query} from '@/shared/configs/api';

export interface ChecklistData {
    id: string;
    text: string[];
    progress: number;
}

export const ChecklistApi = {
    createChecklist: async (todoId: string): Promise<ChecklistData> => {
        const response = await query.post<ChecklistData>(
            `/todos/${todoId}/checklist`
        );
        return response;
    },

    getChecklist: async (todoId: string): Promise<ChecklistData> => {
        const response = await query.get<ChecklistData>(
            `/todos/${todoId}/checklist`
        );
        return response;
    },

    addItem: async (todoId: string, text: string): Promise<ChecklistData> => {
        const response = await query.post<ChecklistData>(
            `/todos/${todoId}/checklist/items`,
            {text}
        );
        return response;
    },

    updateItemText: async (
        todoId: string,
        index: number,
        text: string
    ): Promise<ChecklistData> => {
        const response = await query.patch<ChecklistData>(
            `/todos/${todoId}/checklist/items/${index}`,
            {text}
        );
        return response;
    },

    updateProgress: async (
        todoId: string,
        delta: number
    ): Promise<ChecklistData> => {
        const response = await query.patch<ChecklistData>(
            `/todos/${todoId}/checklist/progress`,
            {delta}
        );
        return response;
    },

    removeItem: async (
        todoId: string,
        index: number
    ): Promise<ChecklistData> => {
        const response = await query.delete<ChecklistData>(
            `/todos/${todoId}/checklist/items/${index}`
        );
        return response;
    },

    deleteChecklist: async (todoId: string): Promise<void> => {
        await query.delete(`/todos/${todoId}/checklist`);
    },
};
