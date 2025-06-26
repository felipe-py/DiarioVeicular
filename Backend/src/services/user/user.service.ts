export type CreateOutputDto = {
    id: string;
    email: string;
    password: string;
    name: string;
    message: string;
};

export type LoginOutputDto = {
    user: {
        id: string;
        email: string;
        name: string;
    }
    token: string;
    message: string;
}

export interface UserService {
    createService(email: string, password: string, name: string): Promise<CreateOutputDto>;
    loginService(email: string, password: string): Promise<LoginOutputDto>;
}