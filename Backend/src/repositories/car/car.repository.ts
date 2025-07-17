import { Car } from "../../entities/car";

export interface CarRepository {
    save(car: Car): Promise<void>;
    update(car: Car): Promise<void>;
    find(car_license: string): Promise<Car | null>;
}