import {
  MaintenanceProps,
  MaintenanceRegister,
} from "../../../entities/maintenance_register";
import { NotFoundError } from "../../../errors/error.NotFoundError";
import { AuthenticationError } from "../../../errors/user.error.Authentication";
import { MaintenanceRegisterRepository } from "../../../repositories/maintenanceRegister/maintenance_register.repository";
import {
  DeleteMaintenanceRegisterOutputDto,
  MaintenanceRegisterOutputDto,
  MaintenanceRegisterService,
  ManyMaintenanceRegistersOutputDto,
  UpdateMaintenanceRegisterOutputDto,
} from "../maintenanceRegister.service";

export class MaintenanceRegisterServiceImplementation
  implements MaintenanceRegisterService
{
  private constructor(readonly repository: MaintenanceRegisterRepository) {}

  public static build(repository: MaintenanceRegisterRepository) {
    return new MaintenanceRegisterServiceImplementation(repository);
  }

  public async createMaintenanceRegisterService(
    maintenanceId: number,
    service: string,
    date: Date,
    carKm: number,
    price: number,
    carLicence: string
  ): Promise<MaintenanceRegisterOutputDto> {
    const aRegister = MaintenanceRegister.create(
      maintenanceId,
      service,
      date,
      carKm,
      price,
      carLicence
    );

    await this.repository.save(aRegister);

    const output: MaintenanceRegisterOutputDto = {
      maintenanceRegister: {
        maintenanceId: aRegister.maintenanceId,
        service: aRegister.service,
        date: aRegister.date,
        carKm: aRegister.carKm,
        price: aRegister.price,
        carLicence: aRegister.carLicense,
      },
      message: "Registro de manutenção cadastrado com sucesso",
    };

    return output;
  }

  public async updateMaintenanceRegisterService(
    maintenanceId: number,
    carLicense: string,
    updateData: Partial<MaintenanceProps>
  ): Promise<UpdateMaintenanceRegisterOutputDto> {
    const aRegister = await this.repository.findById(maintenanceId);

    if (!aRegister) {
      throw new NotFoundError("Registro não encontrado para a atualizaçaõ");
    }

    if (aRegister.carLicense != carLicense) {
      throw new AuthenticationError("Autenticação inválida para a atualização");
    }

    aRegister.update(updateData);

    await this.repository.update(aRegister);

    const output: UpdateMaintenanceRegisterOutputDto = {
      message: `Regsitro n° ${maintenanceId} do veículo ${carLicense} atualizado`,
    };

    return output;
  }

  public async findByIdMaintenanceRegisterService(
    maintenanceId: number
  ): Promise<MaintenanceRegisterOutputDto> {
    const aRegister = await this.repository.findById(maintenanceId);

    if (!aRegister) {
      throw new NotFoundError("Registro não encontrado");
    }

    const output: MaintenanceRegisterOutputDto = {
      maintenanceRegister: {
        maintenanceId: aRegister.maintenanceId,
        service: aRegister.service,
        date: aRegister.date,
        carKm: aRegister.carKm,
        price: aRegister.price,
        carLicence: aRegister.carLicense,
      },
      message: "Informações do registro foram encontradas com sucesso",
    };

    return output;
  }

  public async findByCarLicenseMaintenanceRegisterService(
    carLicense: string
  ): Promise<ManyMaintenanceRegistersOutputDto> {
    const allRegsitersFromCar = await this.repository.findByCarLicense(
      carLicense
    );

    if (!allRegsitersFromCar) {
      throw new NotFoundError("Não foram encontrados regsitros de manutenção");
    }

    const props = allRegsitersFromCar.map((aRegister) => ({
      maintenanceId: aRegister.maintenanceId,
      service: aRegister.service,
      date: aRegister.date,
      carKm: aRegister.carKm,
      price: aRegister.price,
      carLicence: aRegister.carLicense,
    }));

    const output: ManyMaintenanceRegistersOutputDto = {
      cars: props,
      message: "Registros encontrados com sucesso",
    };

    return output;
  }

  public async deleteMaintenanceRegisterService(
    maintenanceId: number
  ): Promise<DeleteMaintenanceRegisterOutputDto> {
    await this.repository.delete(maintenanceId);

    const output: DeleteMaintenanceRegisterOutputDto = {
      maintenanceId: maintenanceId,
      message: "Registro excluído com sucesso",
    };

    return output;
  }
}
