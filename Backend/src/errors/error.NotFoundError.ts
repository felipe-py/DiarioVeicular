import { AppError } from "./AppError";

export class NotFoundError extends AppError {
    constructor(message: string) {
        // Passamos a mensagem e o código de status HTTP 401 (Unauthorized)
        super(message, 404);
    }
}