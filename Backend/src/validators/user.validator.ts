import * as z from "zod"

const validEmailUser = z.string({
    required_error: "Email deve ser obrigatório",
}).email({message: "email inválido"})

const validPasswordUser = z.string({
    required_error: "Senha deve ser obrigatória",
}).min(6, {message: "Senha deve ter no mínimo seis caracteres"});


const validUserName = z.string({
    required_error: "Nome deve ser obrigatório",
}).min(1, {message: "Nome inválido"});

export const validUser = z.object({
    email: validEmailUser,
    password: validPasswordUser,
    name: validUserName
})