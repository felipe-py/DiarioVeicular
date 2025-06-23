export type CreateOutputDto = {
    id: string;
    email: string;
    password: string;
    name: string;
};

export interface UserService {
    create(email: string, password: string, name: string): Promise<CreateOutputDto>;
}