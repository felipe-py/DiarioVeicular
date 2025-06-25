import { User } from "../../../entities/user";
import { UserRepository } from "../../../repositories/user/user.repository";
import { CreateOutputDto, LoginOutputDto, UserService } from "../user.service";
import * as bcrypt from "bcryptjs"

export class UserServiceImplementation implements UserService{
    private constructor(readonly repository: UserRepository) {}

    public static build(repository: UserRepository) {
        return new UserServiceImplementation(repository)
    }

    public async create(email: string, password: string, name: string): Promise<CreateOutputDto> {

        const hashPassword = await bcrypt.hash(password, 10);

        const aUser = User.create(email, hashPassword, name);
        await this.repository.save(aUser);

        const output: CreateOutputDto = {
            id: aUser.id,
            email: aUser.email,
            password: aUser.password,
            name: aUser.name,
            message: "Cadastro realizado com sucesso"
        };

        return output;
        
    }

    public async find(email: string, password: string): Promise<LoginOutputDto> {
        
        const aUser = await this.repository.find(email);

        if (!aUser) {throw new Error("Email ou senha inválidos")};

        const isMatch = await bcrypt.compare(password, aUser.password)

        if (!isMatch) {throw new Error("Email ou senha inválidos")};

        const output: LoginOutputDto = {
            email: aUser.email,
            name: aUser.name,
            message: "Login realizado com sucesso"
        };

        return output;
    }
}