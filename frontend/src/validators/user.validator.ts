import * as z from "zod"

export const registerFormSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório."),
    email: z.string().min(1, "O e-mail é obrigatório.").email("Formato inválido para o e-mail."),
    password: z.string().min(6, "A senha deve ter no mínimo seis caracteres."),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;