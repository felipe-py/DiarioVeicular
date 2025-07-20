import { Car, CarProps } from "../../../entities/car";
import { NotFoundError } from "../../../errors/error.NotFoundError";
import { AuthenticationError } from "../../../errors/user.error.Authentication";
import { CarRepository } from "../../../repositories/car/car.repository";
import { CarService, CarOutputDto, DeleteCarOutputDto, UpdateCarOutputDto } from '../car.service';

export class CarServiceImplementation implements CarService{

    private constructor(readonly repository: CarRepository) {}

    public static build(repository: CarRepository) {
        return new CarServiceImplementation(repository)
    } 

    public async createCarService(car_license: string, brand: string, 
        model: string, color: string, manufacture_year: string, 
        model_year: string, km: number, owner_id: string): Promise<CarOutputDto> {
        
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

        const output: CarOutputDto = {
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

    public async updateCar(owner_id: string, car_license: string, updateData: Partial<CarProps>): Promise<UpdateCarOutputDto> {
        
        const aCar = await this.repository.findByLicense(car_license);

        if(!aCar) { throw new NotFoundError("Veiculo não encontrado para atualização");};

        if(aCar.carOwner != owner_id) { throw new AuthenticationError("Autenticação inválida para a atualização");};

        aCar.update(updateData);

        await this.repository.update(aCar);

        const output: UpdateCarOutputDto = {
            message: `Veículo: ${car_license} atualizado`
        };

        return output;
    }

    public async findCarByLicense(car_license: string): Promise<CarOutputDto> {
        
        const aCar = await this.repository.findByLicense(car_license);

        if (!aCar) { throw new NotFoundError("Veículo não encontrado")};

        const output: CarOutputDto = {
            car_license: aCar.carLicense,
            brand: aCar.carBrand,
            model: aCar.carModel,
            color: aCar.carColor,
            manufacture_year: aCar.carManufactureYear,
            model_year: aCar.carModelYear,
            km: aCar.carKm,
            owner_id: aCar.carOwner,
            message: "Informações do veículo foram encontradas com sucesso"
        }

        return output;
    }

    public async deleteCarService(car_license: string): Promise<DeleteCarOutputDto> {
        
        const deletedCar = await this.repository.delete(car_license);

        const output: DeleteCarOutputDto = {
            car_license: deletedCar.carLicense,
            owner_id: deletedCar.carOwner,
            message: "Registro do veículo excluído com sucesso"
        };

        return output;
    }
}