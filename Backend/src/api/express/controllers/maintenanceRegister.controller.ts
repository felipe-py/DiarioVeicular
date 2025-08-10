import { Request, Response } from "express";
import {
  validRegister,
  validUpdate,
} from "../../../validators/maintenanceRegister.validator";
import { AuthenticationError } from "../../../errors/user.error.Authentication";
import { MaintenanceRegisterRepositoryPrisma } from "../../../repositories/maintenanceRegister/prisma/maintenanceRegister.prisma";
import { prisma } from "../../../util/prisma.util";
import { MaintenanceRegisterServiceImplementation } from "../../../services/maintenanceRegister/implementation/maintenanceRegister.service.implementation";
import { handleErrors } from "../../../util/helpers/handle.error.helper";
import { AppError } from "../../../errors/AppError";

export class MaintenanceRegisterController {
  private constructor() {}

  public static build() {
    return new MaintenanceRegisterController();
  }

  public async create(request: Request, response: Response) {
    const { service, date, carKm, price } = request.body;

    const { carLicense } = request.params;
    const ownerId = request.user?.id;

    try {
      validRegister.parse({
        service,
        date,
        carKm,
        price,
        carLicense,
      });

      if (!ownerId) {
        throw new AuthenticationError("Acesso Negado");
      }

      const aRepository = MaintenanceRegisterRepositoryPrisma.build(prisma);
      const aService =
        MaintenanceRegisterServiceImplementation.build(aRepository);

      const output = await aService.createMaintenanceRegisterService(
        service,
        date,
        carKm,
        price,
        carLicense
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

      const maintenanceId = parseInt(request.params.maintenanceId, 10);

      if (isNaN(maintenanceId)) {
        throw new AppError(
          "O ID do registro de manutenção deve ser um número.",
          400
        );
      }

      if (!ownerId) {
        throw new AuthenticationError("Acesso negado");
      }

      const aRepository = MaintenanceRegisterRepositoryPrisma.build(prisma);
      const aService =
        MaintenanceRegisterServiceImplementation.build(aRepository);

      const output = await aService.updateMaintenanceRegisterService(
        maintenanceId,
        carLicense,
        updateData
      );

      response.status(200).json(output).send();
    } catch (error) {
      const resultError = handleErrors(error);
      response.status(resultError.status).json(resultError.body);
    }
  }

  public async find(request: Request, response: Response) {
    const ownerId = request.user?.id;

    if (!ownerId) {
      throw new AuthenticationError("Acesso negado");
    }

    try {
      const aRepository = MaintenanceRegisterRepositoryPrisma.build(prisma);
      const aService =
        MaintenanceRegisterServiceImplementation.build(aRepository);

      const maintenanceId = parseInt(request.params.maintenanceId, 10);

      if (isNaN(maintenanceId)) {
        throw new AppError(
          "O ID do registro de manutenção deve ser um número.",
          400
        );
      }

      const output = await aService.findByIdMaintenanceRegisterService(
        maintenanceId
      );

      response.status(200).json(output).send();
    } catch (error) {
      const resultError = handleErrors(error);
      response.status(resultError.status).json(resultError.body);
    }
  }

  public async findByCar(request: Request, response: Response) {
    const { carLicense } = request.params;

    const ownerId = request.user?.id;

    if (!ownerId) {
      throw new AuthenticationError("Acesso negado");
    }

    try {
      const aRepository = MaintenanceRegisterRepositoryPrisma.build(prisma);
      const aService =
        MaintenanceRegisterServiceImplementation.build(aRepository);

      const output = await aService.findByCarLicenseMaintenanceRegisterService(
        carLicense
      );

      response.status(201).json(output).send();
    } catch (error) {
      const resultError = handleErrors(error);
      response.status(resultError.status).json(resultError.body);
    }
  }

  public async delete(request: Request, response: Response) {
    const { maintenanceId } = request.body;

    if (isNaN(maintenanceId)) {
      throw new AppError(
        "O ID do registro de manutenção deve ser um número.",
        400
      );
    }

    try {
      const aRepository = MaintenanceRegisterRepositoryPrisma.build(prisma);
      const aService =
        MaintenanceRegisterServiceImplementation.build(aRepository);

      const output = await aService.findByIdMaintenanceRegisterService(
        maintenanceId
      );

      response.status(201).json(output).send();
    } catch (error) {
      const resulError = handleErrors(error);
      response.status(resulError.status).json(resulError.body);
    }
  }
}
