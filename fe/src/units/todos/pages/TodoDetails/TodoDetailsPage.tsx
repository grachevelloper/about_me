import {Flex} from 'antd';
import block from 'bem-cn-lite';
import {useParams} from 'react-router-dom';

import {useTodoQuery} from '../../store';

import {BaseDetails} from './components/BaseDetails';

import './TodoDetailsPage.scss';

const b = block('todo-details-page');

export const TodoDetailsPage = () => {
    const {id} = useParams();
    const {todo, isError, isPending, isPlaceholderData} = useTodoQuery(id!);

    if (isPending || isPlaceholderData) {
        return <div>Is Pending occurred</div>;
    }

    if (isError && !todo) {
        return <div>Some error occurred</div>;
    }

    return (
        <Flex vertical align='start' justify='start' className={b()}>
            <BaseDetails initialData={todo!} />
        </Flex>
    );
};
