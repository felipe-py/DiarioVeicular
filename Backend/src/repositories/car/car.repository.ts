import { Car } from "../../entities/car";

export interface CarRepository {
  save(car: Car): Promise<void>;
  update(car: Car): Promise<void>;
  findByLicense(car_license: string): Promise<Car | null>;
  findByOwner(owner_id: string): Promise<Car[] | null>;
  delete(car_license: string): Promise<void>;
}
