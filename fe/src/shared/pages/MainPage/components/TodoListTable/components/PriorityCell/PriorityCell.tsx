import {useCallback, useRef} from 'react';

import {Priority} from '@/todos/components/Priority';
import {useTodoMutations, useTodoQuery} from '@/todos/store';
import {TodoPriority} from '@/todos/types';

interface TodoStateCellProps {
    priority: TodoPriority;
    todoId: string;
}

export const PriorityCell = ({priority, todoId}: TodoStateCellProps) => {
    const {isPending} = useTodoQuery(todoId);
    const {updatePriority} = useTodoMutations();
    const isEdited = useRef<boolean>(false);

    const handleUpdatePriority = useCallback((newPriority: TodoPriority) => {
        isEdited.current = true;
        updatePriority(todoId, newPriority);
    }, [todoId, updatePriority]);

    return (
        <Priority
            priority={priority}
            editable={{isEdited: isEdited.current}}
            onUpdate={handleUpdatePriority}
            isLoading={isPending}
        />
    );
};
