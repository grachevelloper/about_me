import {useMutation} from '@tanstack/react-query';

import {queryClient} from '@/shared/configs/api';

import api from '../api';
import {DtoSignInUser, DtoSignUpUser} from '../api/types';

export const useSignupMutation = () => {
    return useMutation({
        mutationKey: ['signup'],
        mutationFn: (userData: DtoSignUpUser) => api.signUp(userData),
    });
};

export const useLogoutMutation = () => {
    return useMutation({
        mutationKey: ['logout'],
        mutationFn: () => api.logout(),
    });
};

export const useSigninMutatuon = () => {
    const {mutateAsync, data, isPending, error} = useMutation(
        {
            mutationKey: ['signin'],
            mutationFn: (signInData: DtoSignInUser) => api.signIn(signInData),
        },
        queryClient
    );

    return {user: data, isPending, error, mutateAsync};
};

// export const useUserMutation = () => {
//     const queryClient = useQueryClient();
//     return useMutation(
//         {
//             mutationFn: (updateData: DtoUpdateTodo) =>
//                 api.updateTodoById(updateData),
//             onSuccess: (variables) => {
//                 queryClient.invalidateQueries({
//                     queryKey: ['todos', variables.id],
//                 });
//                 queryClient.invalidateQueries({
//                     queryKey: ['todo', variables.id],
//                 });
//             },
//         },
//         queryClient
//     );
// };
