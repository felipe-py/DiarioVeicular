import { Car } from "../../entities/car";

export interface CarRepository {
  save(car: Car): Promise<void>;
  update(car: Car): Promise<void>;
  findByLicense(carLicense: string): Promise<Car | null>;
  findByOwner(ownerId: string): Promise<Car[] | null>;
  delete(carLicense: string): Promise<void>;
}
