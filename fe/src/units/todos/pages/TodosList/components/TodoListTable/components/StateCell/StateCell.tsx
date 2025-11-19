import {useCallback, useRef} from 'react';

import {State} from '@/todos/components/State';
import {useTodoMutations, useTodoQuery} from '@/todos/hooks';
import {TodoState} from '@/todos/types';

interface TodoStateCellProps {
    state: TodoState;
    todoId: string;
}

const switchNewState = (state: TodoState): TodoState => {
    switch (state) {
        case TodoState.CANCELED:
            return TodoState.IN_WORK;
        case TodoState.PLANNING:
            return TodoState.IN_WORK;
        case TodoState.IN_WORK:
            return TodoState.FINISHED;
        case TodoState.FINISHED:
            return TodoState.IN_WORK;
    }
};

export const StateCell = ({state, todoId}: TodoStateCellProps) => {
    const isEdited = useRef<boolean>(false);
    const {updateState} = useTodoMutations();
    const {isPending} = useTodoQuery(todoId);

    const stateRef = useRef<HTMLButtonElement>(null);

    const handleUpdateState = useCallback(() => {
        isEdited.current = true;
        updateState(todoId, switchNewState(state));
    }, [todoId, isEdited]);

    return (
        <State
            ref={stateRef}
            state={state}
            editable={{isEdited: isEdited.current}}
            onUpdate={handleUpdateState}
            isLoading={isPending}
        />
    );
};
