import * as z from "zod";

const nonEmptyString = z
  .string({
    required_error: "Este campo é obrigatório.",
    invalid_type_error: "Este campo deve ser um texto.",
  })
  .min(1, { message: "Este campo não pode estar vazio" });

const validCarLicense = z.string().regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i, {
  message: "Formato inválido. Use padrão ABC-1234 ou ABC-1D23.",
});

const validKm = z
  .number({
    required_error: "A quilometragem é obrigatória.",
    invalid_type_error: "A quilometragem deve ser um  número",
  })
  .int()
  .positive();

const validPrice = z
  .number({
    required_error: "O preço é obrigatório.",
    invalid_type_error: "O preço deve ser um  número",
  })
  .positive();

const validDate = z.date();

export const validRegister = z.object({
  service: nonEmptyString,
  date: validDate,
  carKm: validKm,
  price: validPrice,
  carLicense: validCarLicense,
});

export const validUpdate = validRegister.partial();
