import { Prisma, PrismaClient } from "@prisma/client";
import { CarRepository } from "../car.repository";
import { Car } from "../../../entities/car";
import { ConflictError } from "../../../errors/user.error.conflict";

export class CarRepositoryPrisma implements CarRepository {
  private constructor(readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new CarRepositoryPrisma(prisma);
  }

  public async save(car: Car): Promise<void> {
    const data = {
      carLicense: car.carLicense,
      brand: car.carBrand,
      model: car.carModel,
      color: car.carColor,
      manufactureYear: car.carManufactureYear,
      modelYear: car.carModelYear,
      km: car.carKm,
      userId: car.carOwner,
    };

    try {
      await this.prisma.car.create({
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

  public async update(car: Car): Promise<void> {
    const data = {
      car_license: car.carLicense,
      brand: car.carBrand,
      model: car.carModel,
      color: car.carColor,
      manufacture_year: car.carManufactureYear,
      model_year: car.carModelYear,
      km: car.carKm,
      user_id: car.carOwner,
    };

    await this.prisma.car.update({
      where: {
        carLicense: car.carLicense,
      },
      data,
    });
  }

  public async findByLicense(carLicense: string): Promise<Car | null> {
    const carFromDb = await this.prisma.car.findUnique({
      where: { carLicense },
    });

    if (!carFromDb) {
      return null;
    }

    const { userId, brand, model, color, manufactureYear, modelYear, km } =
      carFromDb;

    const car = Car.with(
      carLicense,
      brand,
      model,
      color,
      manufactureYear,
      modelYear,
      km,
      userId
    );

    return car;
  }

  public async findByOwner(owner_id: string): Promise<Car[] | null> {
    const cars = await this.prisma.car.findMany({
      where: {
        userId: owner_id,
      },
    });

    if (cars.length === 0) {
      return null;
    }

    return cars.map((carData) => {
      return Car.with(
        carData.carLicense,
        carData.brand,
        carData.model,
        carData.color,
        carData.manufactureYear,
        carData.modelYear,
        carData.km,
        carData.userId
      );
    });
  }

  public async delete(carLicense: string): Promise<void> {
    try {
      await this.prisma.car.delete({
        where: {
          carLicense,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new ConflictError("Veículo não encontrado");
      }
      throw error;
    }
  }
}
