import { InvalidCarKm } from "../errors/carKm.error.invalid";

export type CarProps = {
  carLicense: string;
  brand: string;
  model: string;
  color: string;
  manufactureYear: string;
  modelYear: string;
  km: number;
  ownerId: string;
};

export class Car {
  private constructor(readonly props: CarProps) {}

  public static create(
    carLicense: string,
    brand: string,
    model: string,
    color: string,
    manufactureYear: string,
    modelYear: string,
    km: number,
    ownerId: string
  ) {
    return new Car({
      carLicense,
      brand,
      model,
      color,
      manufactureYear,
      modelYear,
      km,
      ownerId,
    });
  }

  public static with(
    carLicense: string,
    brand: string,
    model: string,
    color: string,
    manufactureYear: string,
    modelYear: string,
    km: number,
    ownerId: string
  ) {
    return new Car({
      carLicense,
      brand,
      model,
      color,
      manufactureYear,
      modelYear,
      km,
      ownerId,
    });
  }

  public update(data: Partial<CarProps>): void {
    if (data.km !== undefined && data.km < this.props.km) {
      throw new InvalidCarKm("A quilometragem não pode ser reduzida");
    }

    Object.assign(this.props, data);
  }

  public get carLicense() {
    return this.props.carLicense;
  }

  public get carBrand() {
    return this.props.brand;
  }

  public get carModel() {
    return this.props.model;
  }

  public get carColor() {
    return this.props.color;
  }

  public get carManufactureYear() {
    return this.props.manufactureYear;
  }

  public get carModelYear() {
    return this.props.modelYear;
  }

  public get carKm() {
    return this.props.km;
  }

  public get carOwner() {
    return this.props.ownerId;
  }
}
