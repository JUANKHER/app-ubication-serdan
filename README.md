# app-ubication-serdan

Detección de Ubicación Falsa (Fake GPS) en Mi Proyecto
Este documento explica la lógica implementada en el proyecto para detectar ubicaciones falsas (Fake GPS) y tomar medidas adecuadas en caso de detección.

Introducción
La detección de ubicaciones falsas es una medida de seguridad importante para garantizar la integridad de la información y evitar el uso indebido de la aplicación. Se busca identificar si un usuario está utilizando técnicas para falsificar su ubicación, como aplicaciones de Fake GPS.

Lógica de Detección
En este proyecto, hemos implementado una lógica básica de detección de ubicación falsa utilizando varios criterios:

Velocidad Anormalmente Alta: Si la velocidad de la ubicación es mayor que un umbral específico, se considera sospechosa. Esto podría indicar que el usuario está utilizando una ubicación falsa para simular un movimiento rápido.

Distancia Anormalmente Grande: Calculamos la distancia entre la ubicación actual y la anterior. Si esta distancia supera un valor umbral, se considera sospechosa. Esto puede indicar que el usuario ha teleportado su ubicación.

Frecuencia de Actualización: Verificamos la frecuencia de actualización de las ubicaciones. Si las ubicaciones 
se actualizan demasiado rápido donde la deje a 1 segundo pero puede se cambiada.

Implementación
La lógica de detección se encuentra en la función analyzeLocationData(location, previousLocation) en el archivo LocationForm.js.


Instalación

En la carpera App se encuentra el apk correspondiente para la instalación.

