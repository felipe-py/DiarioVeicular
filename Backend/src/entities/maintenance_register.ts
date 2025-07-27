export type MaintenanceProps = {
  maintenanceId: number;
  service: string;
  date: Date;
  carKm: number;
  price: number;
  carLicense: string;
};

export class MaintenanceRegister {
  private constructor(readonly props: MaintenanceProps) {}

  public static create(
    maintenanceId: number,
    service: string,
    date: Date,
    carKm: number,
    price: number,
    carLicense: string
  ) {
    return new MaintenanceRegister({
      maintenanceId,
      service,
      date,
      carKm,
      price,
      carLicense,
    });
  }

  public static with(
    maintenanceId: number,
    service: string,
    date: Date,
    carKm: number,
    price: number,
    carLicense: string
  ) {
    return new MaintenanceRegister({
      maintenanceId,
      service,
      date,
      carKm,
      price,
      carLicense,
    });
  }

  public update(data: Partial<MaintenanceProps>): void {
    Object.assign(this.props, data);
  }

  public get maintenanceId() {
    return this.props.maintenanceId;
  }

  public get service() {
    return this.props.service;
  }

  public get date() {
    return this.props.date;
  }

  public get carKm() {
    return this.props.carKm;
  }

  public get price() {
    return this.props.price;
  }

  public get carLicense() {
    return this.props.carLicense;
  }
}
