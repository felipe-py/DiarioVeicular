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
      car_license: car.carLicense,
      brand: car.carBrand,
      model: car.carModel,
      color: car.carColor,
      manufacture_year: car.carManufactureYear,
      model_year: car.carModelYear,
      km: car.carKm,
      user_id: car.carOwner,
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
        car_license: car.carLicense,
      },
      data,
    });
  }

  public async findByLicense(car_license: string): Promise<Car | null> {
    const carFromDb = await this.prisma.car.findUnique({
      where: { car_license },
    });

    if (!carFromDb) {
      return null;
    }

    const { user_id, brand, model, color, manufacture_year, model_year, km } =
      carFromDb;

    const car = Car.with(
      car_license,
      brand,
      model,
      color,
      manufacture_year,
      model_year,
      km,
      user_id
    );

    return car;
  }

  public async findByOwner(owner_id: string): Promise<Car[] | null> {
    const cars = await this.prisma.car.findMany({
      where: {
        user_id: owner_id,
      },
    });

    if (cars.length === 0) {
      return null;
    }

    return cars.map((carData) => {
      return Car.with(
        carData.car_license,
        carData.brand,
        carData.model,
        carData.color,
        carData.manufacture_year,
        carData.model_year,
        carData.km,
        carData.user_id
      );
    });
  }

  public async delete(car_license: string): Promise<void> {
    try {
      await this.prisma.car.delete({
        where: {
          car_license: car_license,
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
