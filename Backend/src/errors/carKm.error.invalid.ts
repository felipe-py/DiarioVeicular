import { AppError } from "./AppError";

export class InvalidCarKm extends AppError {
    constructor(message: string) {
        // Passamos a mensagem e o código de status HTTP 401 (Unauthorized)
        super(message, 400);
    }
}