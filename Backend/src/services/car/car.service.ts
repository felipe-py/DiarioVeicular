import { CarProps } from "../../entities/car";

export type CarOutputDto = {
  car: {
    carLicense: string;
    brand: string;
    model: string;
    color: string;
    manufactureYear: string;
    modelYear: string;
    km: number;
    ownerId: string;
  };
  message: string;
};

type allCars = {
  carLicense: string;
  brand: string;
  model: string;
  color: string;
  manufactureYear: string;
  modelYear: string;
  km: number;
  ownerId: string;
};

export type ManyCarsOutputDto = {
  cars: allCars[];
  message: string;
};

export type UpdateCarOutputDto = {
  message: string;
};

export type DeleteCarOutputDto = {
  carLicense: string;
  message: string;
};

export interface CarService {
  createCarService(
    carLicense: string,
    brand: string,
    model: string,
    color: string,
    manufactureYear: string,
    modelYear: string,
    km: number,
    ownerId: string
  ): Promise<CarOutputDto>;

  findCarByLicense(carLicense: string): Promise<CarOutputDto>;

  findCarByOwner(ownerId: string): Promise<ManyCarsOutputDto>;

  updateCar(
    ownerId: string,
    carLicense: string,
    updateData: Partial<CarProps>
  ): Promise<UpdateCarOutputDto>;

  deleteCarService(carLicense: string): Promise<DeleteCarOutputDto>;
}
