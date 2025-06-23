import { User } from "../../entities/user";

export interface UserRepository {
    save(user: User): Promise<void>;
    update(user: User): Promise<void>;
    find(id: string): Promise<User | null>
}