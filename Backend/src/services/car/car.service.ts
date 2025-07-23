import { CarProps } from "../../entities/car";

export type CarOutputDto = {
  car: {
    car_license: string;
    brand: string;
    model: string;
    color: string;
    manufacture_year: string;
    model_year: string;
    km: number;
    owner_id: string;
  };
  message: string;
};

type allCars = {
  car_license: string;
  brand: string;
  model: string;
  color: string;
  manufacture_year: string;
  model_year: string;
  km: number;
  owner_id: string;
};

export type ManyCarsOutputDto = {
  cars: allCars[];
  message: string;
};

export type UpdateCarOutputDto = {
  message: string;
};

export type DeleteCarOutputDto = {
  car_license: string;
  message: string;
};

export interface CarService {
  createCarService(
    car_license: string,
    brand: string,
    model: string,
    color: string,
    manufacture_year: string,
    model_year: string,
    km: number,
    owner_id: string
  ): Promise<CarOutputDto>;

  findCarByLicense(car_license: string): Promise<CarOutputDto>;

  findCarByOwner(owner_id: string): Promise<ManyCarsOutputDto>;

  updateCar(
    owner_id: string,
    car_license: string,
    updateData: Partial<CarProps>
  ): Promise<UpdateCarOutputDto>;

  deleteCarService(car_license: string): Promise<DeleteCarOutputDto>;
}
