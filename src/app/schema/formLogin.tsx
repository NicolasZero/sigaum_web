import { z } from "zod"

export type FormLoginData = z.infer<typeof formLoginSchema>;

export const formLoginSchema = z.object({
    username: z.string({
        required_error: "Por favor ingrese su usuario.",
    }).min(1, {
        message: "Este campo no puede estar vacío."
    }).max(30, "Máximo 30 caracteres."),

    password: z.string({
        required_error: "Por favor ingrese su contraseña.",
    }).min(1, {
        message: "Este campo no puede estar vacío."
    }).max(30, "Máximo 30 caracteres."),
})

