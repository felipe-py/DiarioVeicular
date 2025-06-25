import { Request, Response } from "express";
import { UserRepositoryPrisma } from "../../../repositories/user/prisma/user.repository.prisma";
import { prisma } from "../../../util/prisma.util";
import { UserServiceImplementation } from "../../../services/user/implementation/user.service.implementation";
import { validLogin, validUser } from "../../../validators/user.validator";
import { handleUserErrors } from "./helpers/handle.error.helper";

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

        const resultError = handleUserErrors(error);

        response.status(resultError.status).json(resultError.body);
    
        }  
    }

    public async login(request: Request, response: Response) {
        const {email, password } = request.body;

        try {

            validLogin.parse({email, password});

            const aRepository = UserRepositoryPrisma.build(prisma);
            const aService = UserServiceImplementation.build(aRepository);

            const output = await aService.find(email, password);

            response.status(200).json(output).send();

        } catch (error) {

        const resultError = handleUserErrors(error);

        response.status(resultError.status).json(resultError.body);
        
        }
    }
    
}