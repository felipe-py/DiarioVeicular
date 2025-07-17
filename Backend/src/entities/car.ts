export type CarProps = {
    car_license: string;
    brand: string;
    model: string;
    color: string;
    manufacture_year: string;
    model_year: string;
    km: number;
    onwer_id: string
}

export class Car {
    private constructor(readonly props: CarProps) {}

    public static create(
        car_license: string,
        brand: string,
        model: string,
        color: string,
        manufacture_year: string,
        model_year: string,
        km: number,
        onwer_id: string) {

            return new Car({
                car_license,
                brand,
                model,
                color,
                manufacture_year,
                model_year,
                km,
                onwer_id,
            });
    }

    public static with (
        car_license: string,
        brand: string,
        model: string,
        color: string,
        manufacture_year: string,
        model_year: string,
        km: number,
        onwer_id: string) {

            return new Car({
                car_license,
                brand,
                model,
                color,
                manufacture_year,
                model_year,
                km,
                onwer_id
            });
        }

    public get carLicense() {
        return this.props.car_license;
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
        return this.props.manufacture_year;
    }

    public get carModelYear() {
        return this.props.model_year;
    }

    public get carKm() {
        return this.props.km;
    }

    public get carOnwer() {
        return this.props.onwer_id;
    }
}