import * as yup from 'yup'

export const RegistroValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email('Ingresa un email valido')
        .required('El email es requerido'),
    password: yup
        .string()
        .min(5, 'Muy corta!')
        .max(1000, 'To long')
        .required('La contraseña es requirida'),
    phoneNumber: yup
        .number()
        .min(10,'Minimo 10 numeros')
        .required('El telefono es requerido'),
    nombre: yup
        .string()
        .required('Es requerido un nombre de Usuario')
})