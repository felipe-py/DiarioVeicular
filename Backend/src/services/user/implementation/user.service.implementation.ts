import { User } from "../../../entities/user";
import { AuthenticationError } from "../../../errors/user/user.error.Authentication";
import { ConflictError } from "../../../errors/user/user.error.conflict";
import { UserRepository } from "../../../repositories/user/user.repository";
import { handleUserErrors } from "../../../util/helpers/handle.error.helper";
import { handleGenerateToken } from "../../../util/helpers/handle.generate.token";
import { handleNullValues } from "../../../util/helpers/handle.null.values";
import { CreateOutputDto, LoginOutputDto, UserService } from "../user.service";
import * as bcrypt from "bcryptjs"

export class UserServiceImplementation implements UserService{
    private constructor(readonly repository: UserRepository) {}

    public static build(repository: UserRepository) {
        return new UserServiceImplementation(repository)
    }

    public async createService(email: string, password: string, name: string): Promise<CreateOutputDto> {

        const hashPassword = await bcrypt.hash(password, 10);

        const aUser = User.create(email, hashPassword, name);

        await this.repository.save(aUser);

        const output: CreateOutputDto = {
            id: aUser.id,
            email: aUser.email,
            name: aUser.name,
            message: "Cadastro realizado com sucesso"
        };

        return output;
        
    }

    public async loginService(email: string, password: string): Promise<LoginOutputDto> {
        
        const aUser = await this.repository.find(email);

        handleNullValues(aUser, "Email ou senha inválidos");

        const isMatch = await bcrypt.compare(password, aUser.password);

        if (!isMatch) {
            throw new AuthenticationError("Email ou senha inválidos");
        }

        const tokenGerado = handleGenerateToken(aUser);

        const output: LoginOutputDto = {
            user: {
                id: aUser.id,
                email: aUser.email,
                name: aUser.name,
            },
            token: tokenGerado,
            message: "Login realizado com sucesso"
        };

        return output;
    }
}