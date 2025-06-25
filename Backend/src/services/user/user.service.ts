export type CreateOutputDto = {
    id: string;
    email: string;
    password: string;
    name: string;
    message: string;
};

export type LoginOutputDto = {
    email: string;
    name: string;
    message: string;
}

export interface UserService {
    create(email: string, password: string, name: string): Promise<CreateOutputDto>;
    find(email: string, password: string): Promise<LoginOutputDto>;
}