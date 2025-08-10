import { Prisma, PrismaClient } from "@prisma/client";
import { MaintenanceRegisterRepository } from "../maintenanceRegister.repository";
import {
  MaintenanceProps,
  MaintenanceRegister,
} from "../../../entities/maintenanceRegister";
import { ConflictError } from "../../../errors/user.error.conflict";

export class MaintenanceRegisterRepositoryPrisma
  implements MaintenanceRegisterRepository
{
  private constructor(readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new MaintenanceRegisterRepositoryPrisma(prisma);
  }

  public async save(register: MaintenanceRegister): Promise<void> {
    const data = {
      service: register.service,
      date: register.date,
      carKm: register.carKm,
      price: register.price,
      carLicense: register.carLicense,
    };

    try {
      await this.prisma.maintenanceRegister.create({
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictError("Informação inválida");
      }
      throw error;
    }
  }

  public async update(register: MaintenanceProps): Promise<void> {
    const data = {
      maintenanceId: register.maintenanceId,
      service: register.service,
      date: register.date,
      carKm: register.carKm,
      price: register.price,
      carLicense: register.carLicense,
    };

    await this.prisma.maintenanceRegister.update({
      where: {
        maintenanceId: register.maintenanceId,
      },
      data,
    });
  }

  public async findById(
    maintenanceId: number
  ): Promise<MaintenanceRegister | null> {
    const registerFromDb = await this.prisma.maintenanceRegister.findUnique({
      where: { maintenanceId },
    });

    if (!registerFromDb) {
      return null;
    }

    const { service, date, carKm, price, carLicense } = registerFromDb;

    const maintenanceRegister = MaintenanceRegister.with(
      maintenanceId,
      service,
      date,
      carKm,
      price.toNumber(),
      carLicense
    );

    return maintenanceRegister;
  }

  public async findByCarLicense(
    carLicense: string
  ): Promise<MaintenanceRegister[] | null> {
    const registers = await this.prisma.maintenanceRegister.findMany({
      where: {
        carLicense: carLicense,
      },
    });

    if (registers.length === 0) {
      return null;
    }

    return registers.map((registerData) => {
      return MaintenanceRegister.with(
        registerData.maintenanceId,
        registerData.service,
        registerData.date,
        registerData.carKm,
        registerData.price.toNumber(),
        registerData.carLicense
      );
    });
  }

  public async delete(maintenanceId: number): Promise<void> {
    try {
      await this.prisma.maintenanceRegister.delete({
        where: {
          maintenanceId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new ConflictError("Registro de manutenção não encontrado");
      }
      throw error;
    }
  }
}
