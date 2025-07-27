import { Car, CarProps } from "../../../entities/car";
import { NotFoundError } from "../../../errors/error.NotFoundError";
import { AuthenticationError } from "../../../errors/user.error.Authentication";
import { CarRepository } from "../../../repositories/car/car.repository";
import {
  CarService,
  CarOutputDto,
  DeleteCarOutputDto,
  UpdateCarOutputDto,
  ManyCarsOutputDto,
} from "../car.service";

export class CarServiceImplementation implements CarService {
  private constructor(readonly repository: CarRepository) {}

  public static build(repository: CarRepository) {
    return new CarServiceImplementation(repository);
  }

  public async createCarService(
    carLicense: string,
    brand: string,
    model: string,
    color: string,
    manufactureYear: string,
    modelYear: string,
    km: number,
    ownerId: string
  ): Promise<CarOutputDto> {
    const aCar = Car.create(
      carLicense,
      brand,
      model,
      color,
      manufactureYear,
      modelYear,
      km,
      ownerId
    );

    await this.repository.save(aCar);

    const output: CarOutputDto = {
      car: {
        carLicense: aCar.carLicense,
        brand: aCar.carBrand,
        model: aCar.carModel,
        color: aCar.carColor,
        manufactureYear: aCar.carManufactureYear,
        modelYear: aCar.carModelYear,
        km: aCar.carKm,
        ownerId: aCar.carOwner,
      },
      message: "Veículo cadastrado com sucesso",
    };

    return output;
  }

  public async updateCar(
    ownerId: string,
    carLicense: string,
    updateData: Partial<CarProps>
  ): Promise<UpdateCarOutputDto> {
    const aCar = await this.repository.findByLicense(carLicense);

    if (!aCar) {
      throw new NotFoundError("Veiculo não encontrado para atualização");
    }

    if (aCar.carOwner != ownerId) {
      throw new AuthenticationError("Autenticação inválida para a atualização");
    }

    aCar.update(updateData);

    await this.repository.update(aCar);

    const output: UpdateCarOutputDto = {
      message: `Veículo: ${carLicense} atualizado`,
    };

    return output;
  }

  public async findCarByLicense(carLicense: string): Promise<CarOutputDto> {
    const aCar = await this.repository.findByLicense(carLicense);

    if (!aCar) {
      throw new NotFoundError("Veículo não encontrado");
    }

    const output: CarOutputDto = {
      car: {
        carLicense: aCar.carLicense,
        brand: aCar.carBrand,
        model: aCar.carModel,
        color: aCar.carColor,
        manufactureYear: aCar.carManufactureYear,
        modelYear: aCar.carModelYear,
        km: aCar.carKm,
        ownerId: aCar.carOwner,
      },
      message: "Informações do veículo foram encontradas com sucesso",
    };

    return output;
  }

  public async findCarByOwner(ownerId: string): Promise<ManyCarsOutputDto> {
    const allCarsFromUser = await this.repository.findByOwner(ownerId);

    if (!allCarsFromUser) {
      throw new NotFoundError("Não foram encontrados veículos");
    }

    const props = allCarsFromUser.map((aCar) => ({
      carLicense: aCar.carLicense,
      brand: aCar.carBrand,
      model: aCar.carModel,
      color: aCar.carColor,
      manufactureYear: aCar.carManufactureYear,
      modelYear: aCar.carModelYear,
      km: aCar.carKm,
      ownerId: aCar.carOwner,
    }));

    const output: ManyCarsOutputDto = {
      cars: props,
      message: "Veículos encontrados com sucesso",
    };

    return output;
  }

  public async deleteCarService(
    carLicense: string
  ): Promise<DeleteCarOutputDto> {
    await this.repository.delete(carLicense);

    const output: DeleteCarOutputDto = {
      carLicense: carLicense,
      message: "Registro do veículo excluído com sucesso",
    };

    return output;
  }
}
