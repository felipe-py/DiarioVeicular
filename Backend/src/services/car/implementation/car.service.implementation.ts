import { Car } from "../../../entities/car";
import { CarRepository } from "../../../repositories/car/car.repository";
import { CarService, CreateCarOutputDto, DeleteCarOutputDto } from '../car.service';

export class CarServiceImplementation implements CarService{

    private constructor(readonly repository: CarRepository) {}

    public static build(repository: CarRepository) {
        return new CarServiceImplementation(repository)
    } 

    public async createCarService(car_license: string, brand: string, 
        model: string, color: string, manufacture_year: string, 
        model_year: string, km: number, owner_id: string): Promise<CreateCarOutputDto> {
        
            const aCar = Car.create(
                car_license,
                brand,
                model,
                color,
                manufacture_year,
                model_year,
                km, 
                owner_id
            )

        await this.repository.save(aCar);

        const output: CreateCarOutputDto = {
            car_license: aCar.carLicense,
            brand: aCar.carBrand,
            model: aCar.carModel,
            color: aCar.carColor,
            manufacture_year: aCar.carManufactureYear,
            model_year: aCar.carModelYear,
            km: aCar.carKm,
            owner_id: aCar.carOwner,
            message: "Veículo cadastrado com sucesso"
        };

        return output;
    }

    public async deleteCarService(car_license: string): Promise<DeleteCarOutputDto> {
        
        const deletedCar = await this.repository.delete(car_license);

        const output: DeleteCarOutputDto = {
            car_license: deletedCar.carLicense,
            owner_id: deletedCar.carOwner,
            message: "Registro do veículo excluído com sucessor"
        };

        return output;
    }
}