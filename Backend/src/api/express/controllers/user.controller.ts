import { Request, Response } from "express";
import { UserRepositoryPrisma } from "../../../repositories/user/prisma/user.repository.prisma";
import { prisma } from "../../../util/prisma.util";
import { UserServiceImplementation } from "../../../services/user/implementation/user.service.implementation";

export class UserController {
    private constructor() {}

    public static build() {
        return new UserController();
    }

    public async create(request: Request, response: Response) {
        const { email, password, name } = request.body;

        const aRepository = UserRepositoryPrisma.build(prisma);
        const aService = UserServiceImplementation.build(aRepository);

        const output = await aService.create(email, password, name)

        const data = {
            id: output.id,
            email,
            password,
            name,
        };

        response.status(201).json(data).send();
    }
    
}