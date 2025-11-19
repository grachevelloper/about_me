import {useParams} from 'react-router-dom';

import {useTodoQuery} from '../../hooks';

import {BaseDetails} from './components/BaseDetails';
import {BaseDetailsSkeleton} from './components/BaseDetails/BaseDetailsSkeleton';

export const TodoDetailsPage = () => {
    const {id} = useParams();
    const {todo, isPending, isError} = useTodoQuery(id!);

    if (isPending) {
        return <BaseDetailsSkeleton />;
    }

    if (isError || !todo) {
        return <div>Some error occurred</div>;
    }

    return <BaseDetails initialData={todo} />;
};
