import { User } from "../../entities/user";

export interface UserRepository {
    save(user: User): Promise<void>;
    update(user: User): Promise<void>;
    find(email: string): Promise<User | null>
}