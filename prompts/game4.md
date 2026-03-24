# Especificación Técnica: Juego 4 - Contagio en el Salón (Final)

## 1. Contexto del Proyecto (Casino-UTM)
- **Objetivo:** Aplicación web de juegos de azar que desmitifican mitos de probabilidad.
- **Arquitectura:** Clean Architecture simplificada.
  - `/domain`: Lógica pura y motores matemáticos.
  - `/presentation/controllers`: Orquestadores de UI y eventos.
  - `/presentation/views`: Estructura HTML.
  - `/assets/css`: Estilos visuales (Neon/Glassmorphism).

## 2. Definición del Juego
- **Nombre:** "Contagio en el Salón"
- **Mito a desmentir:** "Un contagio ocurre al azar y no depende del contacto."
- **Conceptos Clave:** Eventos dependientes y Probabilidad Condicional $P(A|B)$.

## 3. Requisitos de Lógica (`domain/epidemic_engine.js`)
- **Simulación Dinámica**: Motor de partículas estilo Agar.io.
- **Nodos**: Objetos `{ id, nombre, x, y, vx, vy, estado: 'sana' | 'contagiada' }`.
- **Nombres**: Asignación de nombres aleatorios de una lista genérica.
- **Regla de Contagio**: Basada en proximidad física (`infectionRadius`). Si un nodo sano está cerca de uno contagiado, existe probabilidad `p` de infección.
- **Aceleración**: El límite de contagios por ronda aumenta automáticamente cada vez que se avanza.

## 4. Requisitos de UI (`presentation/controllers/game4_controller.js`)
- **Interacción Principal**: 
  1. El usuario selecciona una persona sana.
  2. Define el **Monto a Apostar** (mínimo 5 fichas).
  3. **Validación de Saldo**: Antes de procesar la ronda, se debe verificar que el usuario tenga suficientes fichas. Si no, se muestra un mensaje de "Fichas insuficientes".
  4. Al presionar "Siguiente Ronda", se ejecuta el motor y se actualiza el wallet según el resultado.
- **Visualización**: Animación fluida mediante `requestAnimationFrame` a 60 FPS.
- **Feedback**: Mensajes personalizados usando el nombre de la persona seleccionada.

## 5. Requisitos Visuales (`assets/css/game4.css`)
- **Estilo**: Glassmorphism con efectos neón.
- **Nodos**: Círculos con núcleos brillantes y etiquetas de nombre flotantes.
- **Colores**: 
  - Sano: Cian neón.
  - Contagiado: Rojo neón con animación `pulse`.
  - Seleccionado: Oro neón con resplandor.
- **Panel de Resultados**: Colores semánticos (Verde para acierto, Rojo para fallo, Dorado para final).

## 6. Instrucciones para la IA
1. Implementar usando **ES Modules**.
2. Garantizar que la velocidad de movimiento sea lenta y natural.
3. **Control de Economía**: El sistema de apuestas DEBE validar el saldo mediante `wallet_manager.js` antes de permitir cualquier operación de cobro.
4. Mostrar una ventana emergente o modal si el usuario intenta apostar más de lo que posee.
