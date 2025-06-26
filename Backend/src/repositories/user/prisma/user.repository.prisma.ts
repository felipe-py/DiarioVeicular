import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../user.repository";
import { User } from "../../../entities/user";
import { Prisma } from "../../../generated/prisma";

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

            await this.prisma.user.create({
            data,
            });

        } catch (error) {

            if ( error instanceof Prisma.PrismaClientKnownRequestError) {
                
                if (error.code === 'P2002') {
                    throw new Error("Email inválido"); 
                }
            }

            throw error;

        }

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