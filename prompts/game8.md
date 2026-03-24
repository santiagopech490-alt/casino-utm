# Especificación Técnica: Juego 8 - La ilusión de la precisión (Tragamonedas)

## 1. Contexto del Proyecto (Casino-UTM)
- **Objetivo:** Aplicación web de juegos de azar que desmitifican mitos de probabilidad.
- **Arquitectura:** Clean Architecture simplificada.
  - `/domain`: Lógica pura y motores matemáticos.
  - `/presentation/controllers`: Orquestadores de UI y eventos.
  - `/presentation/views`: Estructura HTML.
  - `/assets/css`: Estilos visuales (Neon/Glassmorphism).

## 2. Definición del Juego
- **Nombre:** "La ilusión de la precisión" (Tragamonedas / Slots)
- **Mito a desmentir:** "Si algo casi ocurre, significa que estamos cerca de lograrlo." (Falacia del casi-acierto o Near-miss).
- **Conceptos Clave:** Independencia de eventos y Percepción vs. Probabilidad real.

## 3. Requisitos de Lógica (`domain/slot_engine.js`)
- **Símbolos y Tabla de Pagos:** 
  - '7': 100 fichas.
  - 'Estrella': 1000 fichas.
  - 'Campana': 25 fichas.
  - 'Cereza': 15 fichas.
- **Motor de Resultados:** El generador aleatorio produce el resultado de los 3 rodillos.
- **Manipulación Educativa (Near-miss):** El motor genera un "casi-acierto" (ej. 7-7-X) con alta probabilidad en pérdidas para ilustrar la falacia.

## 4. Requisitos de UI (`presentation/controllers/game8_controller.js`)
- **Interacción Principal:**
  1. Costo por giro: 50 fichas.
  2. Presiona "Girar".
  3. **Validación de Saldo:** Requiere 50 fichas mediante `wallet_manager.js`.
  4. **Animación Dinámica:** Los rodillos muestran símbolos aleatorios (emojis) rápidamente mientras giran antes de detenerse secuencialmente de izquierda a derecha.
- **Feedback Educativo:**
  - Near-miss: Explica la independencia de los rodillos.
  - Victoria: Explica que la probabilidad no cambia por el historial.

## 5. Requisitos Visuales (`assets/css/game8.css`)
- **Estilo:** Glassmorphism neón.
- **Rodillos:** Animación CSS de desplazamiento y desenfoque.
- **Semántica:** Iluminación dorada para near-miss y verde para victoria.

## 6. Instrucciones para la IA
1. Usar **ES Modules**.
2. Garantizar animación de al menos 2 segundos con parada escalonada.
3. **Control de Economía:** Restar 50 fichas al inicio.
4. Mostrar Modal explicativo en bancarrota sobre el diseño psicológico de las tragamonedas.
