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
- **Explicación del Mito:** Este mito se rompió al demostrar que en las máquinas tragamonedas, los rodillos son controlados por un **Generador de Números Aleatorios (RNG)** independiente para cada parada. Un "casi-acierto" (como obtener dos símbolos iguales y uno diferente por un milímetro) es programado deliberadamente para crear una ilusión de proximidad, cuando en realidad la probabilidad de ganar en el siguiente giro sigue siendo exactamente la misma.
- **Conceptos Clave:** Independencia de eventos y Percepción vs. Probabilidad real.

## 3. Requisitos de Lógica (`domain/slot_engine.js`)
- **Símbolos y Tabla de Pagos:** 
  - 'Jackpot (💰)': 5000 fichas (Peso: 1).
  - 'Estrella (⭐)': 1000 fichas (Peso: 3).
  - 'Diamante (💎)': 500 fichas (Peso: 7).
  - '7 (7️⃣)': 100 fichas (Peso: 12).
  - 'Bar (🎰)': 50 fichas (Peso: 20).
  - 'Campana (🔔)': 25 fichas (Peso: 27).
  - 'Cereza (🍒)': 15 fichas (Peso: 30).
- **Motor de Resultados:** Generador aleatorio mediante **probabilidades ponderadas** para simular una economía de casino realista.
- **Manipulación Educativa (Near-miss):** El motor genera un "casi-acierto" (ej. 7-7-X) con un 40% de probabilidad en las jugadas perdedoras, utilizando preferentemente símbolos de alto valor.

## 4. Requisitos de UI (`presentation/controllers/game8_controller.js`)
- **Interacción Principal:**
  1. Costo por giro: 50 fichas.
  2. **Palanca Interactiva 3D Mejorada:** Estructura volumétrica con profundidad real. Al activarse, la palanca se inclina **hacia abajo (hacia el usuario)** mediante una rotación negativa en el eje X, eliminando la sensación de imagen plana.
  3. **Validación de Saldo:** Requiere 50 fichas mediante `wallet_manager.js`.
  4. **Animación Dinámica:** Los rodillos muestran símbolos aleatorios (emojis) rápidamente mientras giran antes de detenerse secuencialmente de izquierda a derecha.
  5. **Sonidos de Casino:** 
     - Tirón de Palanca: Sonido de resorte o engranaje.
     - Giro: Sonido mecánico repetitivo.
     - Parada: Impacto seco al detenerse cada rodillo.
     - Victoria: Melodía festiva.
     - Jackpot: Sonido de alta energía y larga duración.

## 5. Requisitos Visuales (`assets/css/game8.css`)
- **Estilo:** Glassmorphism neón.
- **Palanca 3D Volumétrica:** Construida con `transform-style: preserve-3d` y pseudo-elementos (`::before`) para dar grosor al eje metálico. El pomo utiliza gradientes radiales complejos para simular una esfera física.
- **Animación:** Rotación de -75deg en el eje X para el efecto de "tirar hacia adelante/abajo".
- **Rodillos:** Animación CSS de desplazamiento y desenfoque.
- **Semántica:** 
  - Iluminación dorada para near-miss.
  - Verde para victoria estándar.
  - Rosa/Neón intenso para Jackpot.

## 6. Instrucciones para la IA
1. Usar **ES Modules**.
2. Garantizar animación de al menos 2 segundos con parada escalonada.
3. **Control de Economía:** Restar 50 fichas al inicio.
4. Mostrar Modal explicativo en bancarrota sobre el diseño psicológico de las tragamonedas.
5. Sincronizar con `sound_manager.js` para los efectos auditivos.
