import {useCallback, useRef} from 'react';

import {Priority} from '@/todos/components/Priority';
import {useTodoMutations, useTodoQuery} from '@/todos/hooks';
import {TodoPriority} from '@/todos/types';

interface TodoStateCellProps {
    priority: TodoPriority;
    todoId: string;
}

const switchNewPriority = (priority: TodoPriority): TodoPriority => {
    switch (priority) {
        case TodoPriority.LOW:
            return TodoPriority.MEDIUM;
        case TodoPriority.MEDIUM:
            return TodoPriority.HIGH;
        case TodoPriority.HIGH:
            return TodoPriority.SUPER;
        case TodoPriority.SUPER:
            return TodoPriority.LOW;
    }
};

export const PriorityCell = ({priority, todoId}: TodoStateCellProps) => {
    const {isPending} = useTodoQuery(todoId);
    const {updatePriority} = useTodoMutations();
    const isEdited = useRef<boolean>(false);

    const handleUpdatePriority = useCallback(() => {
        isEdited.current = true;
        updatePriority(todoId, switchNewPriority(priority));
    }, [todoId, isEdited]);

    return (
        <Priority
            priority={priority}
            editable={{isEdited: isEdited.current}}
            onUpdate={handleUpdatePriority}
            isLoading={isPending}
        />
    );
};
