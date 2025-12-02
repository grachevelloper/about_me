export interface User {
    id: string;
    email: string;
    avatar?: string;
    username?: string;
    password: string;
}

export interface SubmitData {
    isLoading: boolean;
    onSubmit: () => void;
}
