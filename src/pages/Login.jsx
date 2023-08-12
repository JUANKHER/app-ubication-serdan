import React from "react";
import { Formik, useField } from "formik";
import { StyleSheet, Button, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Link, useNavigate } from "react-router-native"; // Importa los componentes necesarios
import StyleTextInput from "../components/StyleTextInput";
import StyledText from "../components/StyledText";
import { LoginValidationSchema } from "../ValidationSchemas/login";
import { Image, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const DatabaseConnection = {
    getConnection: () => SQLite.openDatabase("database.db"),
  };
const db = DatabaseConnection.getConnection();

const initialValues = {
    email: '',
    password: ''
}
const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 350, // Ajusta la altura según tus necesidades
        resizeMode: 'cover', // Ajusta la forma en que la imagen se ajusta al espacio
        marginVertical: 10
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 20,
        marginTop: -5
    },
    registerText: {
        marginTop: 10,
        color: 'blue', // Puedes ajustar el color según tu diseño
        textDecorationLine: 'underline',
    },
    form: {
        margin: 12,
        marginVertical: 80
    }
})

const FormikInputValue = ({name, ...props}) => {
    const [field, meta, helpers] = useField(name)
    return (
        <>
            <StyleTextInput 
            error={meta.error}
            value={field.value}
            onChangeText={value => helpers.setValue(value)}    
            {...props}
            /> 
            {meta.error && <StyledText style={styles.error}>{meta.error}</StyledText>}
        </>
    )
}

const handleLogin = async (values) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM usuarios WHERE UPPER(email) = UPPER(?) AND password = ?',
                [values.email, values.password],
                (_, result) => {
                    if (result.rows.length === 1) {
                        // Autenticación exitosa
                        console.log('Inicio de sesión exitoso:', result.rows.item(0));

                        resolve(); // Resolve the promise for successful authentication
                    } else {
                        // Autenticación fallida
                        console.log('Credenciales inválidas');
                        Alert.alert('Error', 'Credenciales inválidas');
                        reject(); // Reject the promise for authentication failure
                    }
                },
                (error) => {
                    console.log('Error al consultar datos:', error);
                    reject(); // Reject the promise for error during authentication
                }
            );
        });
    });
};

export default function LogInPage () {
    const navigate = useNavigate(); // Obtiene la función de navegación

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Formik validationSchema={LoginValidationSchema} initialValues={initialValues} onSubmit={(values, { setSubmitting }) => {
                    handleLogin(values)
                        .then(() => {
                            navigate('/location'); 
                        })
                        .catch(() => {
                            // Do nothing here, the rejection is already handled in handleLogin
                        })
                        .finally(() => {
                            setSubmitting(false);
                        });
                }}>
                    {({ handleSubmit }) => {
                        return (
                            <View style={styles.form}>
                                <Image
                                    source={require('../img/login.png')}
                                    style={styles.image}
                                />
                                
                                <FormikInputValue 
                                    name='email'
                                    placeholder="E-mail"
                                />
                                <FormikInputValue 
                                    name="password"
                                    placeholder="Password"
                                    secureTextEntry
                                />
                                <View>
                                    <Button onPress={handleSubmit} title="Log In" />

                                    {/* Agrega el enlace para "Registrarse" */}
                                    <Link to="/registro">
                                        <Text style={styles.registerText}>Registrarse</Text>
                                    </Link>
                                </View>
                            </View>
                    )
                    }}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}