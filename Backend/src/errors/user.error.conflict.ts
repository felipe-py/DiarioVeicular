import { AppError } from "./AppError";

export class ConflictError extends AppError {
    constructor(message: string) {
        // Chamamos o construtor da classe pai (AppError)
        // passando a mensagem e o código de status HTTP 409 (Conflict)
        super(message, 409);
    }
}