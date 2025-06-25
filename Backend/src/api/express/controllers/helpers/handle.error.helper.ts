import { ZodError } from "zod";

type outputError = {
    status: number;
    body: {
        message: string,
        errors?: any, 
    };
};


export function handleUserErrors(error: unknown): outputError {
    if (error instanceof ZodError) {
        return {status: 400, 
            body: {
                message: "Erro de validação nos dados enviados.",
                errors: error.flatten().fieldErrors,
            },
        };
    };

    console.error(error); 
    
    return {
        status: 500,
        body: {
            message: "Erro interno no servidor",
        }
    }
}