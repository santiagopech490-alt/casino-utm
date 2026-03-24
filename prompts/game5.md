# Especificación Técnica: Juego 5 - ¿La suerte mejora con más intentos? (Final)

## 1. Contexto del Proyecto (Casino-UTM)
- **Objetivo:** Aplicación web de juegos de azar que desmitifican mitos de probabilidad.
- **Arquitectura:** Clean Architecture simplificada.
  - `/domain`: Lógica pura y motores matemáticos.
  - `/presentation/controllers`: Orquestadores de UI y eventos.
  - `/presentation/views`: Estructura HTML.
  - `/assets/css`: Estilos visuales (Neon/Glassmorphism).

## 2. Definición del Juego
- **Nombre:** "Tómbola de la Suerte" (o "¿La suerte mejora con más intentos?")
- **Mito a desmentir:** "Si intento muchas veces, seguro lo logro."
- **Conceptos Clave:** Eventos independientes, Probabilidad repetida y Frecuencia esperada.

## 3. Requisitos de Lógica (`domain/tombola_engine.js`)
- **Motor de Probabilidad**: Generador de resultados para un sistema de premio raro.
- **Regla de Tómbola**: Eventos estrictamente independientes. La probabilidad de ganar el premio es exactamente del 5% en cada tiro, sin importar los resultados anteriores.
- **Límite de Sesión**: El motor permite un máximo de 100 intentos por ciclo.
- **Variables de Estado**:
  - `intentosRealizados`: Contador numérico que inicia en 0.
  - `esGanador`: Booleano que determina el resultado del tiro actual.
- **Retorno de Datos**: Tras cada tiro, el motor debe devolver un objeto `{ intentoActual, resultado: 'ganador' | 'perdedor', probabilidadAplicada: 0.05 }`.

## 4. Requisitos de UI (`presentation/controllers/game5_controller.js`)
- **Interacción Principal**:
  1. El usuario visualiza la Tómbola y el costo fijo por tiro (10 fichas).
  2. **Modo Manual**: Botón "Tirar de la Tómbola".
  3. **Modo Automático**: Botón "Modo Auto" que ejecuta tiros cada 300ms. Se detiene si el usuario pulsa "Detener", si gana, si llega a 100 intentos o si se queda sin fichas.
  4. **Límite de Intentos**: Al llegar a 100 intentos, se bloquean los tiros y aparece "Reiniciar Tómbola".
  5. **Validación de Saldo**: Antes de cada tiro, se verifica el saldo.
- **Visualización**: 
  - Una **Barra de Progreso** que representa el avance hacia los 100 intentos.
  - Un **Área de Registro (Log)** que muestra el historial de tiros.
- **Función de Reinicio**: Restablece el contador, vacía logs y permite un nuevo ciclo.

## 5. Requisitos Visuales (`assets/css/game5.css`)
- **Estilo**: Glassmorphism con efectos neón.
- **Botón de Reinicio**: Estilo `secondary-btn`, visible tras finalizar un ciclo.
- **Controles Auto**: Botones de "Modo Auto" y "Detener" que alternan visibilidad.

## 6. Instrucciones para la IA
1. Implementar usando **ES Modules**.
2. Garantizar independencia de eventos (5% fijo por tiro).
3. **Gestión de Ciclos**: Al ganar o llegar a 100, forzar reinicio.
4. **Control de Economía**: Integración con `wallet_manager.js`.
5. **Modo Auto**: Implementar bucle de ejecución rápido con parada automática en condiciones críticas.
