import { MaintenanceProps } from "../../entities/maintenance_register";

export type MaintenanceRegisterOutputDto = {
  maintenanceRegister: {
    maintenanceId: number;
    service: string;
    date: Date;
    carKm: number;
    price: number;
    carLicence: string;
  };
  message: string;
};

export type UpdateMaintenanceRegisterOutputDto = {
  message: string;
};

type allRegisters = {
  maintenanceId: number;
  service: string;
  date: Date;
  carKm: number;
  price: number;
  carLicence: string;
};

export type ManyMaintenanceRegistersOutputDto = {
  cars: allRegisters[];
  message: string;
};

export type DeleteMaintenanceRegisterOutputDto = {
  maintenanceId: number;
  message: string;
};

export interface MaintenanceRegisterService {
  createMaintenanceRegisterService(
    maintenanceId: number,
    service: string,
    date: Date,
    carKm: number,
    price: number,
    carLicence: string
  ): Promise<MaintenanceRegisterOutputDto>;

  updateMaintenanceRegisterService(
    maintenanceId: number,
    carLicense: string,
    updateData: Partial<MaintenanceProps>
  ): Promise<UpdateMaintenanceRegisterOutputDto>;

  findByIdMaintenanceRegisterService(
    maintenanceId: number
  ): Promise<MaintenanceRegisterOutputDto>;

  findByCarLicenseMaintenanceRegisterService(
    carLicense: string
  ): Promise<ManyMaintenanceRegistersOutputDto>;

  deleteMaintenanceRegisterService(
    maintenanceId: number
  ): Promise<DeleteMaintenanceRegisterOutputDto>;
}
