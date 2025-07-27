import { Request, Response } from "express";
import { CarRepositoryPrisma } from "../../../repositories/car/prisma/car.repository.prisma";
import { prisma } from "../../../util/prisma.util";
import { CarServiceImplementation } from "../../../services/car/implementation/car.service.implementation";
import { handleErrors } from "../../../util/helpers/handle.error.helper";
import { AuthenticationError } from "../../../errors/user.error.Authentication";
import {
  validCar,
  validCarLicenseInput,
  validUpdate,
} from "../../../validators/car.validator";

export class CarController {
  private constructor() {}

  public static build() {
    return new CarController();
  }

  public async create(request: Request, response: Response) {
    const { carLicense, brand, model, color, manufactureYear, modelYear, km } =
      request.body;

    // DESTA FORMA ELE PEGA O ID DIRETEMENTE DO TOKEN JWT
    const ownerId = request.user?.id;

    try {
      validCar.parse({
        carLicense,
        brand,
        model,
        color,
        manufactureYear,
        modelYear,
        km,
      });

      if (!ownerId) {
        throw new AuthenticationError("Acesso negado");
      }

      const aRepository = CarRepositoryPrisma.build(prisma);
      const aService = CarServiceImplementation.build(aRepository);

      const output = await aService.createCarService(
        carLicense,
        brand,
        model,
        color,
        manufactureYear,
        modelYear,
        km,
        ownerId
      );

      response.status(201).json(output).send();
    } catch (error) {
      const resultError = handleErrors(error);
      response.status(resultError.status).json(resultError.body);
    }
  }

  public async update(request: Request, response: Response) {
    try {
      const updateData = validUpdate.parse(request.body);

      const { carLicense } = request.params;
      const ownerId = request.user?.id;

      if (!ownerId) {
        throw new AuthenticationError("Acesso negado");
      }

      const aRepository = CarRepositoryPrisma.build(prisma);
      const aService = CarServiceImplementation.build(aRepository);

      const output = await aService.updateCar(ownerId, carLicense, updateData);

      response.status(200).json(output).send();
    } catch (error) {
      const resultError = handleErrors(error);
      response.status(resultError.status).json(resultError.body);
    }
  }

  public async find(request: Request, response: Response) {
    const { carLicense } = request.body;

    validCarLicenseInput.parse({ carLicense });

    try {
      const aRepository = CarRepositoryPrisma.build(prisma);
      const aService = CarServiceImplementation.build(aRepository);

      const output = await aService.findCarByLicense(carLicense);

      response.status(200).json(output).send();
    } catch (error) {
      const resultError = handleErrors(error);
      response.status(resultError.status).json(resultError.body);
    }
  }

  public async findByOwner(request: Request, response: Response) {
    const ownerId = request.user?.id;

    if (!ownerId) {
      throw new AuthenticationError("Acesso negado");
    }

    try {
      const aRepository = CarRepositoryPrisma.build(prisma);
      const aService = CarServiceImplementation.build(aRepository);

      const output = await aService.findCarByOwner(ownerId);

      response.status(200).json(output).send();
    } catch (error) {
      const resultError = handleErrors(error);
      response.status(resultError.status).json(resultError.body);
    }
  }

  public async delete(request: Request, response: Response) {
    const { carLicense } = request.body;

    validCarLicenseInput.parse({ carLicense });

    try {
      const aRepository = CarRepositoryPrisma.build(prisma);
      const aService = CarServiceImplementation.build(aRepository);

      const output = await aService.deleteCarService(carLicense);

      response.status(201).json(output).send();
    } catch (error) {
      const resultError = handleErrors(error);
      response.status(resultError.status).json(resultError.body);
    }
  }
}
