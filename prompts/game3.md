# Prompt: Desarrollo del Juego 3 - La carta que nunca sale (Versión con Baraja Aleatoria)

**Rol:** Actúa como un Desarrollador Web Senior experto en Vanilla JS, HTML5 y CSS3, y como un profesor de Probabilidad y Estadística.

**Contexto del Proyecto:** SPA "CASINO UTM" con Clean Architecture, diseño Glassmorphism y un Wallet Global de fichas.

**Tarea:** Modifica profundamente la lógica del **"Juego 3"**. Ahora, en lugar de un sorteo aleatorio, el juego presenta una baraja de 20 cartas con valores generados al azar, y el jugador tiene dos formas de jugar.

### Flujo del Juego:
1.  Al iniciar, se genera una "baraja" de 20 cartas. Cada una recibe un valor aleatorio del 1 al 20 (los números pueden repetirse, y algunos pueden no aparecer). El jugador las ve boca abajo.
2.  El jugador introduce su número de apuesta (1-20) en el campo de texto. Esto habilita las acciones.
3.  El jugador ajusta el monto de su apuesta.
4.  El jugador elige una de dos acciones. **Cualquier acción termina la ronda.**
    *   **Opción A: Revelar una Carta.**
        *   El jugador hace clic en una de las 20 cartas del tablero.
        *   Se cobra el monto de la apuesta (Costo x1).
        *   La carta se voltea. Si el número revelado coincide con su apuesta, gana el **doble** de lo apostado (Premio x2).
    *   **Opción B: Revelar Todas.**
        *   El jugador presiona el botón "Revelar Todas".
        *   Se cobra el **doble** del monto de la apuesta (Costo x2).
        *   Todas las 20 cartas se voltean. Si el número de su apuesta se encuentra entre cualquiera de las cartas reveladas, gana el **triple** de lo apostado (Premio x3).
5.  Después de la acción, se muestra un modal que indica si ganó o perdió, el premio obtenido y un botón para "Jugar de Nuevo", que reinicia el tablero con una nueva baraja aleatoria.

### Requisitos técnicos y Archivos a modificar:

**1. `presentation/views/game3_cartas.html` (Modificación):**
*   Reemplazar el botón `#btn-draw` por `#btn-reveal-all` con el texto "Revelar Todas (Costo x2)".

**2. `assets/css/game3.css` (Modificación):**
*   Implementar estilos para que las `.mini-card` puedan voltearse. Esto requiere una estructura interna (ej. `.mini-card-inner` con un anverso y un reverso) y una clase `.is-flipped` que active la animación de `transform: rotateY(180deg)`.
*   Añadir estilos para el anverso de la carta (`.mini-card-front`) con estados `.win` y `.loss`.

**3. `presentation/controllers/game3_controller.js` (Reescritura mayor):**
*   **Generación de Baraja:**
    *   Crear una función `generateGridDeck()` que genere un array de 20 números aleatorios (1-20, con reemplazo) y lo guarde en `gameState.gridDeck`.
    *   Llamar a esta función en `resetGameState()`.
*   **Renderizado de Cartas:** `renderCardsGrid` debe crear la estructura HTML para las cartas volteables (con anverso y reverso).
*   **Nuevas Acciones de Juego:**
    *   `handleCardClick` (Revelar una): Debe contener la lógica del juego para revelar una sola carta, calcular coste/premio y finalizar la ronda.
    *   `handleRevealAll` (Revelar todas): Debe contener la lógica para el coste x2, la búsqueda del número en `gameState.gridDeck`, el cálculo del premio x3 y la finalización de la ronda.
    *   El antiguo `handleDraw` debe ser eliminado.
*   **Control de Estado:** El `gameState` debe incluir `gameEnded` para bloquear acciones después de que se haya revelado una carta o todas. `setControls` debe ser actualizado para manejar este estado.

**Restricción:** La lógica de la baraja es fundamental. Debe generarse una nueva baraja aleatoria en cada `resetGameState` para que la probabilidad cambie en cada partida.
