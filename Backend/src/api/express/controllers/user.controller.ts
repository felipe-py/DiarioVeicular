import { Request, Response } from "express";
import { UserRepositoryPrisma } from "../../../repositories/user/prisma/user.repository.prisma";
import { prisma } from "../../../util/prisma.util";
import { UserServiceImplementation } from "../../../services/user/implementation/user.service.implementation";
import { validUser } from "../../../validators/user.validator";
import { ZodError } from "zod";

export class UserController {
    private constructor() {}

    public static build() {
        return new UserController();
    }

    public async create(request: Request, response: Response) {
        const { email, password, name } = request.body;

        try {

            validUser.parse({email, password, name})

            const aRepository = UserRepositoryPrisma.build(prisma);
            const aService = UserServiceImplementation.build(aRepository);

            const output = await aService.create(email, password, name)

            response.status(201).json(output).send();
        
        } catch (error) {

            if (error instanceof ZodError) {
                return response.status(400).json({
                    message: "Erro de validação",
                    errors: error.flatten().fieldErrors,
                });
            }

            console.error(error); 
            return response.status(500).json({
                message: "Ocorreu um erro interno no servidor.",
            });
        }  
    }
    
}