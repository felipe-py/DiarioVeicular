import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../user.repository";
import { User } from "../../../entities/user";
import { Prisma } from "../../../generated/prisma";
import { ConflictError } from "../../../errors/user/user.error.conflict";

export class UserRepositoryPrisma implements UserRepository {
    private constructor(readonly prisma: PrismaClient) {}

    public static build(prisma: PrismaClient) {
        return new UserRepositoryPrisma(prisma);
    }

    public async save(user: User): Promise<void> {
        const data = {
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
        };

        try {
        // Tenta a inserção diretamente (1 chamada ao banco)
            await this.prisma.user.create({ data: user });
        } catch (error) {
        // Se falhar por e-mail duplicado, o Prisma lança o P2002
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            // E nós o traduzimos para um erro de negócio
                throw new ConflictError("Este e-mail já está em uso.");
            }
        // Se for outro erro, ele continua "borbulhando"
        throw error;
    }

        await this.prisma.user.create({
        data,
        });

    }

    public async update(user: User): Promise<void> {
        const data = {
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
        };

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data,
        });    
    }

    public async find(email: string): Promise<User | null> {
        const aUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!aUser) { return null };

        const { id, password, name} = aUser;

        const user = User.with(id, email, password, name);

        return user
    }

}