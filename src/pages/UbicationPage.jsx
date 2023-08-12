import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, FlatList, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import * as SQLite from 'expo-sqlite';
import { format } from 'date-fns';
import { useNavigate } from "react-router-native";
import { Alert } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
    width: '100%',
    paddingVertical: 40
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  locationText: {
    marginBottom: 20,
    marginVertical: 60
  },
  listItem: {
    marginBottom: 10,
  },
});

const DatabaseConnection = {
  getConnection: () => SQLite.openDatabase("database.db"),
};
const db = DatabaseConnection.getConnection();

export default function LocationForm() {
  const [location, setLocation] = useState(null);
  const [previousLocation, setPreviousLocation] = useState(null); 
  const [errorMessage, setErrorMessage] = useState(null);
  const [locationsList, setLocationsList] = useState([]);
  const [username, setUsername] = useState('Usuario');

  useEffect(() => {
    // Cargar las últimas 10 ubicaciones al montar el componente
    loadLastLocations();
  }, []);

  const loadLastLocations = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM ubicaciones ORDER BY fecha DESC LIMIT 10',
        [],
        (_, result) => {
          const locations = [];
          for (let i = 0; i < result.rows.length; i++) {
            locations.push(result.rows.item(i));
          }
          setLocationsList(locations);
          setUsername('SERDAN');
        },
        (error) => {
          console.log('Error al cargar las ubicaciones:', error);
        }
      );
    });
  };
  
  const handleGetLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMessage('Permiso de ubicación denegado');
        return;
      }
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString(); // Convierte a formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
      let location = await Location.getCurrentPositionAsync({});
       // Realizar análisis de datos de ubicación
      const isSuspicious = analyzeLocationData(location, previousLocation);

      if (isSuspicious) {
        // Realizar acciones en caso de detección de ubicación falsa
        handleSuspiciousLocation(location.coords.latitude, location.coords.longitude, formattedDate, 'Sospechosa');
        return;
      }
      setPreviousLocation(location);
      setLocation(location);
      // Verificar frecuencia entre ubicaciones
      const timeElapsed = calculateTimeElapsed(previousLocation, location);
      // Obtener la fecha y hora actual
      
      const maxTimeThreshold = 1000; // 1 segundos (ajusta según tus necesidades)
      if (timeElapsed < maxTimeThreshold) {
        // Si el tiempo transcurrido entre ubicaciones es menor al umbral,
        // considerar la ubicación como sospechosa
        handleSuspiciousLocation2();
        return;
      }
     

      // Guardar la ubicación en la base de datos junto con la fecha y hora
      saveLocationToDatabase(location.coords.latitude, location.coords.longitude, formattedDate, 'Valida');

      // Actualizar la lista de ubicaciones
      loadLastLocations();
    } catch (error) {
      setErrorMessage('Error al obtener la ubicación: ' + error.message);
    }
  };
  const calculateTimeElapsed = (startLocation, endLocation) => {
    if (!startLocation || !endLocation) {
      return 0;
    }

    const startTime = startLocation.timestamp;
    const endTime = endLocation.timestamp;

    return endTime - startTime;
  }
  const analyzeLocationData = (location, previousLocation) => {
    // Verificar si la velocidad es anormalmente alta (puedes ajustar este valor según tus necesidades)
    const maxSpeedThreshold = 50; // en metros por segundo
    if (location.coords.speed > maxSpeedThreshold) {
      return true; // Ubicación sospechosa por velocidad
    }
  
    // Verificar si la distancia entre la ubicación actual y la anterior es anormalmente grande
    if (previousLocation) {
      const distance = haversineDistance(
        previousLocation.coords.latitude,
        previousLocation.coords.longitude,
        location.coords.latitude,
        location.coords.longitude
      );
  
      const maxDistanceThreshold = 1000; // en metros
      if (distance > maxDistanceThreshold) {
        return true; // Ubicación sospechosa por distancia
      }
    }
    
    return false; // No se detectaron ubicaciones sospechosas
  };
  
  // Función para calcular la distancia entre dos puntos geográficos utilizando la fórmula de Haversine
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  const degToRad = (deg) => {
    return deg * (Math.PI / 180);
  };
  
  const handleSuspiciousLocation = (latitude, longitude, fecha) => {
    // Guardar la ubicación en la base de datos junto con la fecha y hora
    saveLocationToDatabase(latitude, longitude, fecha,'Falsa');    
    Alert.alert('Alerta', 'La ubicacion actual es sospechosa.');
    // Actualizar la lista de ubicaciones
    loadLastLocations();
  };
  const handleSuspiciousLocation2 = () => {
    Alert.alert('Advertencia', 'No es permitido registrar la ubicacion en menos del rango permitido (1 seg).');
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes realizar cualquier acción necesaria antes de cerrar sesión

    // Redirige al usuario a la página de inicio de sesión
    navigate("/");
  };
  const saveLocationToDatabase = (latitude, longitude, fecha, estado) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO ubicaciones (latitude, longitude, fecha, estado) VALUES (?, ?, ?, ?)',
        [latitude, longitude, fecha, estado],
        () => {
          console.log('Ubicación guardada en la base de datos');
        },
        (error) => {
          console.log('Error al guardar la ubicación en la base de datos:', error);
        }
      );
    });
  };

  return (
    <SafeAreaView  style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{username}</Text>
        <Button title="Cerrar Sesión" onPress={handleLogout} />
      </View>
      <Text style={styles.locationText}>
        {location
          ? `Latitud: ${location.coords.latitude}, Longitud: ${location.coords.longitude}`
          : errorMessage || 'Presiona el botón para obtener la ubicación'}
      </Text>
      <Button title="Registrar Ubicación" onPress={handleGetLocation} />

      <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Últimas 10 ubicaciones:</Text>
      <FlatList
        data={locationsList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.listItem}>
            {`Latitud: ${item.latitude}, Longitud: ${item.longitude}, Fecha: ${format(new Date(item.fecha), 'dd/MM/yyyy HH:mm')}, Status: ${item.estado}`}
          </Text>
        )}
      />
    </SafeAreaView>
  );
}
