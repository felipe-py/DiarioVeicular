import { PrismaClient } from '@prisma/client';
import { CarRepository } from '../car.repository';
import { Car } from '../../../entities/car';
import { Prisma } from '../../../generated/prisma';
import { ConflictError } from '../../../errors/user/user.error.conflict';

export class CarRepositoryPrisma implements CarRepository {

    private constructor(readonly prisma: PrismaClient) {}

    public static build(prisma: PrismaClient){
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
            user_id: car.carOnwer,
        };

        try {
            await this.prisma.car.create({
                data,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
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
            user_id: car.carOnwer,
        };

        await this.prisma.car.update({
            where: {
                car_license: car.carLicense,
            },
            data,
        }); 
        
    }

    public async find(car_license: string): Promise<Car | null> {
        
        const aCar = await this.prisma.car.findUnique({
            where: { car_license },
        });

        if (!aCar) { return null };

        const { brand, model, color, manufacture_year, model_year, km, onwer} = aCar;

        const car = Car.with(car_license, brand, model, color, manufacture_year, model_year, km, onwer);

        return car;
    }
}