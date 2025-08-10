import { MaintenanceRegister } from "../../entities/maintenanceRegister";

export interface MaintenanceRegisterRepository {
  save(register: MaintenanceRegister): Promise<void>;
  update(register: MaintenanceRegister): Promise<void>;
  findById(maintenanceId: number): Promise<MaintenanceRegister | null>;
  findByCarLicense(carLicense: string): Promise<MaintenanceRegister[] | null>;
  delete(maintenanceId: number): Promise<void>;
}
