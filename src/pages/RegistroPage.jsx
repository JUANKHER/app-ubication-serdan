import React, { useEffect } from 'react';
import { Formik, useField } from "formik";
import { StyleSheet, Button, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Link } from "react-router-native";
import StyleTextInput from "../components/StyleTextInput";
import StyledText from "../components/StyledText";
import { RegistroValidationSchema } from "../ValidationSchemas/registro"; // Asegúrate de tener el esquema de validación
import { Image, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const DatabaseConnection = {
    getConnection: () => SQLite.openDatabase("database.db"),
  };
const db = DatabaseConnection.getConnection();

const initialValues = {
    email: '',
    password: '',
    phoneNumber: '', // Nuevo campo para el teléfono
    nombre: ''
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 250, // Ajusta la altura según tus necesidades
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
    backLink: {
        backgroundColor: '#248eff', // Color de fondo del botón
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    backLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, // Espacio entre el enlace y la imagen
    },
    backText: {
        fontSize: 16, // Cambiar el tamaño de la fuente del texto
        color: '#fff'
    },
    form: {
        margin: 12,
        marginVertical: 80
    }});

const FormikInputValue = ({ name, ...props }) => {
    const [field, meta, helpers] = useField(name);
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
    );
};

const handleRegistro = async (values) => {
    /*console.log(values)
        // Dirección IP y puerto de tu API local en XAMPP
        const apiUrl = 'http://127.0.0.1:80/rest/src/post.php';
        const data = {
            email: 'ejemplo@correo.com',
            phoneNumber: '1234567890',
            password: 'contraseña123',
            nombre: 'JUAN V'
          };
        fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          .then((response) => response.json())
          .then((data) => {
            console.log('Respuesta de la API:', data);
          })
          .catch((error) => {
            console.error('Error al hacer la petición:', error);
          }); 
          
            
          */
    // Insertar datos en la tabla de usuarios
    //console.log(values['email'])
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM usuarios WHERE email = ?',
            [values['email']],
            (_, result) => {
                if (result.rows.length === 0) {
                    // El email no existe, proceder con la inserción
                    db.transaction((tx) => {
                        tx.executeSql(
                            'INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
                            [values['nombre'], values['email'], values['password'], values['phoneNumber']],
                            (_, insertResult) => {
                                console.log('Datos insertados correctamente:', insertResult);

                                // Mostrar alerta de guardado exitoso
                                Alert.alert('Guardado exitoso', 'Los datos se han guardado correctamente');
                            },
                            (insertError) => {
                                console.log('Error al insertar datos:', insertError);
                            }
                        );
                    });
                } else {
                    // El email ya existe, mostrar una alerta
                    Alert.alert('Error', 'El email ya está registrado. Por favor, use otro email.');
                }
            },
            (error) => {
                console.log('Error al consultar datos:', error);
            }
        );
    });
};

const RegistroPage = () => {
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Formik validationSchema={RegistroValidationSchema} initialValues={initialValues} onSubmit={handleRegistro}>
                    {({ handleSubmit }) => {
                        return (
                            
                            <View style={styles.form}>
                                <View style={styles.backLinkContainer}>
                                    <Link to="/" style={styles.backLink}>
                                        <Text style={styles.backText}>Volver</Text>                        
                                    </Link>
                                </View>
                                <Image
                                    source={require('../img/registro.jpg')}
                                    style={styles.image}
                                />
                                <FormikInputValue 
                                    name='nombre'
                                    placeholder="Nombre"
                                />
                                <FormikInputValue
                                    name="phoneNumber"
                                    placeholder="Teléfono"
                                    keyboardType="numeric"
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
                                    <Button onPress={handleSubmit} title="Registrarse" />
                                </View>
                                
                            </View>
                        );
                    }}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegistroPage;
