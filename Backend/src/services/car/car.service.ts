export type CreateCarOutputDto = {
    car_license: string;
    brand: string;
    model: string;
    color: string;
    manufacture_year: string;
    model_year: string;
    km: number;
    onwer_id: string;
    message: string;
}

export interface CarService {
    createCarService(car_license: string,
    brand: string,
    model: string,
    color: string,
    manufacture_year: string,
    model_year: string,
    km: number,
    onwer_id: string): Promise<CreateCarOutputDto>;
}