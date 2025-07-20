import { CarProps } from "../../entities/car";

export type CarOutputDto = {
    car_license: string;
    brand: string;
    model: string;
    color: string;
    manufacture_year: string;
    model_year: string;
    km: number;
    owner_id: string;
    message: string;
}

export type UpdateCarOutputDto = {
    message: string;
}

export type DeleteCarOutputDto = {
    car_license: string;
    owner_id: string;
    message: string;
}

export interface CarService {

    createCarService(
        car_license: string,
        brand: string,
        model: string,
        color: string,
        manufacture_year: string,
        model_year: string,
        km: number,
        owner_id: string): Promise<CarOutputDto>;

    findCarByLicense(car_license: string): Promise<CarOutputDto>;
    
    updateCar(owner_id: string, car_license: string, updateData: Partial<CarProps>): Promise<UpdateCarOutputDto>;

    deleteCarService(car_license: string): Promise<DeleteCarOutputDto>;

}