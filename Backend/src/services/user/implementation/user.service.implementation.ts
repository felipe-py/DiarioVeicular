import { User } from "../../../entities/user";
import { UserRepository } from "../../../repositories/user/user.repository";
import { CreateOutputDto, UserService } from "../user.service";

export class UserServiceImplementation implements UserService{
    private constructor(readonly repository: UserRepository) {}

    public static build(repository: UserRepository) {
        return new UserServiceImplementation(repository)
    }

    public async create(email: string, password: string, name: string): Promise<CreateOutputDto> {

        const aUser = User.create(email, password, name);
        await this.repository.save(aUser);

        const output: CreateOutputDto = {
            id: aUser.id,
            email: aUser.email,
            password: aUser.password,
            name: aUser.name,
        };

        return output;
        
    }
}