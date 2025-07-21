import { AppError } from "./AppError";

export class InvalidCarKm extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}