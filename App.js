import React from 'react';
import Main from './src/components/Main';
import { NativeRouter } from 'react-router-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';

const DatabaseConnection = {
  getConnection: () => SQLite.openDatabase("database.db"),
};
const db = DatabaseConnection.getConnection();
// Crear la tabla de usuarios
db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT, password TEXT, telefono TEXT)',
    [],
    () => {
      console.log('Tabla de usuarios creada correctamente');
    },
    (error) => {
      console.log('Error al crear la tabla de usuarios:', error);
    }
  );

  // Crear la tabla de ubicaciones
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS ubicaciones (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL, estado TEXT, fecha DATETIME)',
    [],
    () => {
      console.log('Tabla de ubicaciones creada correctamente');
    },
    (error) => {
      console.log('Error al crear la tabla de ubicaciones:', error);
    }
  );
});
export default function App() {
  return (
    <>
      <StatusBar style='light' />
      <NativeRouter>
        <Main />
      </NativeRouter>
    </>
  );
}
