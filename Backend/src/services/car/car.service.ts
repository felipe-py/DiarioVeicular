export type CreateCarOutputDto = {
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
        owner_id: string): Promise<CreateCarOutputDto>;

    deleteCarService(car_license: string): Promise<DeleteCarOutputDto>;
}