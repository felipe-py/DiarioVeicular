import { Request, Response } from "express";
import { CarRepositoryPrisma } from "../../../repositories/car/prisma/car.repository.prisma";
import { prisma } from "../../../util/prisma.util";
import { CarServiceImplementation } from "../../../services/car/implementation/car.service.implementation";
import { handleErrors } from "../../../util/helpers/handle.error.helper";
import { AuthenticationError } from "../../../errors/user/user.error.Authentication";

export class CarController{

    private constructor() {}

    public static build() {
        return new CarController();
    }

    public async create(request: Request, response: Response) {
        
        const { car_license, brand, model, color, manufacture_year, model_year, km } = request.body
        const onwer_id = request.user?.id;

        try {

            if(!onwer_id) { throw new AuthenticationError("Acesso negado"); }

            const aRepository = CarRepositoryPrisma.build(prisma);
            const aService = CarServiceImplementation.build(aRepository);

            const output = await aService.createCarService(car_license, brand, model, color, manufacture_year, model_year, km, onwer_id);

            response.status(201).json(output).send();

        } catch (error) {
            const resultError = handleErrors(error);
            response.status(resultError.status).json(resultError.body);
        }
    }
}