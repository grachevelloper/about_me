import {
    useMutation,
    useQuery,
    useQueryClient,
    useSuspenseQuery,
} from '@tanstack/react-query';

import {queryClient} from '@/shared/configs/api';

import api from '../api';
import {DtoCreateTodo, DtoUpdateTodo} from '../api/types';
import {TodoPriority, TodoState} from '../types';

export const useTodosQuery = () => {
    const {data} = useSuspenseQuery({
        queryKey: ['todos'],
        queryFn: api.listTodos,
    });

    return {data};
};

export const useTodoQuery = (todoId: string) => {
    const {data, isPending, isError} = useQuery(
        {
            queryKey: ['todo', todoId],
            queryFn: () => api.getTodoById(todoId),
        },
        queryClient
    );

    return {todo: data, isPending, isError};
};

export const useCreateTodoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (createData: DtoCreateTodo) =>
                api.createTodo(createData),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['todos'],
                });
            },
        },
        queryClient
    );
};

export const useTodoMutations = () => {
    const queryClient = useQueryClient();

    const baseMutation = useMutation(
        {
            mutationFn: (updateData: DtoUpdateTodo) =>
                api.updateTodoById(updateData),
            onMutate: async (variables) => {
                await queryClient.cancelQueries({
                    queryKey: ['todo', variables.id],
                });

                const previousTodo = queryClient.getQueryData<Todo>([
                    'todo',
                    variables.id,
                ]);

                if (previousTodo) {
                    queryClient.setQueryData(['todo', variables.id], {
                        ...previousTodo,
                        ...variables,
                    });
                }

                return {previousTodo};
            },
            onError: (err, variables, context) => {
                if (context?.previousTodo) {
                    queryClient.setQueryData(
                        ['todo', variables.id],
                        context.previousTodo
                    );
                }
            },
            onSettled: (data, error, variables) => {
                // Инвалидируем кэш после завершения мутации
                queryClient.invalidateQueries({
                    queryKey: ['todo', variables.id],
                });
                queryClient.invalidateQueries({queryKey: ['todos']});
            },
        },
        queryClient
    );

    const updateTitle = (id: string, title: string) => {
        return baseMutation.mutateAsync({id, title});
    };

    const updatePriority = (id: string, priority: TodoPriority) => {
        return baseMutation.mutateAsync({id, priority});
    };

    const updateState = (id: string, state: TodoState) => {
        return baseMutation.mutateAsync({id, state});
    };

    const updateChecklist = (id: string, checklist: string[]) => {
        return baseMutation.mutateAsync({id, checklist});
    };

    const updateContent = (id: string, content: string) => {
        return baseMutation.mutateAsync({id, content});
    };

    return {
        mutation: baseMutation,

        updateTitle,
        updatePriority,
        updateState,
        updateChecklist,
        updateContent,

        isPending: baseMutation.isPending,
        isError: baseMutation.isError,
        error: baseMutation.error,
    };
};
