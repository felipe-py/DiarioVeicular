import { Request, Response } from "express";
import { CarRepositoryPrisma } from "../../../repositories/car/prisma/car.repository.prisma";
import { prisma } from "../../../util/prisma.util";
import { CarServiceImplementation } from "../../../services/car/implementation/car.service.implementation";
import { handleErrors } from "../../../util/helpers/handle.error.helper";
import { AuthenticationError } from "../../../errors/user.error.Authentication";
import { validCar, validCarLicenseInput, validUpdate } from "../../../validators/car.validator";

export class CarController{

    private constructor() {}

    public static build() {
        return new CarController();
    }

    public async create(request: Request, response: Response) {
        
        const { car_license, brand, model, color, manufacture_year, model_year, km } = request.body
        
        // DESTA FORMA ELE PEGA O ID DIRETEMENTE DO TOKEN JWT
        const onwer_id = request.user?.id;

        try {

            validCar.parse({car_license, brand, model, color, manufacture_year, model_year, km});

            if(!onwer_id) { throw new AuthenticationError("Acesso negado"); };

            const aRepository = CarRepositoryPrisma.build(prisma);
            const aService = CarServiceImplementation.build(aRepository);

            const output = await aService.createCarService(car_license, brand, model, color, manufacture_year, model_year, km, onwer_id);

            response.status(201).json(output).send();

        } catch (error) {

            const resultError = handleErrors(error);
            response.status(resultError.status).json(resultError.body);
        
        }
    }

    public async update(request: Request, response: Response) {

        try {

            const updateData = validUpdate.parse(request.body);

            const { car_license } = request.params;
            const owner_id = request.user?.id;

            if(!owner_id) { throw new AuthenticationError("Acesso negado"); };
        
            const aRepository = CarRepositoryPrisma.build(prisma);
            const aService = CarServiceImplementation.build(aRepository);

            const output = await aService.updateCar(owner_id, car_license, updateData);

            response.status(200).json(output).send();

        } catch (error) {

            const resultError = handleErrors(error);
            response.status(resultError.status).json(resultError.body);

        }
        
        
    }

    public async find(request: Request, response: Response) {
        
        const { car_license } = request.body;

        validCarLicenseInput.parse({car_license});

        try {

            const aRepository = CarRepositoryPrisma.build(prisma);
            const aService = CarServiceImplementation.build(aRepository);

            const output = await aService.findCarByLicense(car_license);

            response.status(201).json(output).send();

        } catch (error) {

            const resultError = handleErrors(error);
            response.status(resultError.status).json(resultError.body);

        }
    }

    public async delete(request: Request, response: Response) {

        const { car_license } = request.body;

        validCarLicenseInput.parse({car_license});

        try {

            const aRepository = CarRepositoryPrisma.build(prisma);
            const aService = CarServiceImplementation.build(aRepository);

            const output = await aService.deleteCarService(car_license);

            response.status(201).json(output).send();

        } catch (error) {

            const resultError = handleErrors(error);
            response.status(resultError.status).json(resultError.body);

        }
    }
}