import * as z from "zod"

const nonEmptyString = z.string({
    required_error: "Este campo é obrigatório.",
    invalid_type_error: "Este campo deve ser um texto.",
}).min(1, { message: "Este campo não pode estar vazio"});

const validCarLicense = z.string().regex(
    /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i, {
        message: "Formato inválido. Use padrão ABC-1234 ou ABC-1D23."
    }
);

const validYear = z.string().regex(
    /^\d{4}$/, {
        message: "O ano deve conter 4 dígitos."
    }
);

const validKm = z.number({
    required_error: "A quilometragem é obrigatória.",
    invalid_type_error: "A quilometragem deve ser um  número"
}).int().positive()

export const validCar = z.object({
    car_license: validCarLicense,
    brand: nonEmptyString,
    model: nonEmptyString,
    color: nonEmptyString,
    manufactureYear: validYear,
    model_year: validYear,
    km: validKm
});

export const validCarLicenseInput = z.object({
    car_license: validCarLicense
});