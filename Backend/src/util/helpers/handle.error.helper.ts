import { ZodError } from "zod";
import { ConflictError } from "../../errors/user/user.error.conflict";
import { AuthenticationError } from "../../errors/user/user.error.Authentication";

type output = {
    status: number;
    body: {
        message: string,
        errors?: any, 
    };
};


export function handleErrors(error: unknown): output {
    
    if (error instanceof ZodError) {
        return {status: 400, 
            body: {
                message: "Erro de validação nos dados enviados.",
                errors: error.flatten().fieldErrors,
            },
        };
    };

    if (error instanceof ConflictError) {
        return {
            status: error.statusCode,
            body: {
                message: error.message
            }
        }
    }

    if (error instanceof AuthenticationError) {
        return {
            status: error.statusCode,
            body: {
                message: error.message
            }
        }
    }

    console.error(error); 
    
    return {
        status: 500,
        body: {
            message: "Erro interno no servidor",
        }
    }
}