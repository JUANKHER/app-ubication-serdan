import * as yup from 'yup'

export const LoginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email('Ingresa un email valido')
        .required('El email es requerido'),
    password: yup
        .string()
        .min(5, 'Muy corta!')
        .max(1000, 'To long')
        .required('La contraseña es requirida')
})