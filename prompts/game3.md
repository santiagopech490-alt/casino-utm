# Prompt: Desarrollo del Juego 3 - La Carta que Nunca Sale (Simulador de Mazo de 20)

**Rol:** Actúa como un Desarrollador Web Senior experto en Vanilla JS y Psicología del Juego.

**Contexto:** SPA "CASINO UTM" con diseño Glassmorphism y Wallet Global.

**Tarea:** Implementar un simulador de mazo de 20 cartas con reposición total, siguiendo estas especificaciones:

### 1. Lógica de Sorteo y Aleatoriedad
*   **Modos de Robo:**
    *   **1x1 (Con Reposición):** El usuario selecciona su carta (1-20) y se genera un resultado único con reposición total (la misma carta puede salir varias veces seguidas).
    *   **Full 20 (Sin Reposición):** Se genera un mazo completo de 20 cartas únicas (1-20) barajadas. Esto sirve para contrastar la distribución perfecta frente a la aleatoriedad con reposición.

### 2. Sistema de Incentivos (Psicología)
*   **Algoritmo Hot/Cold:** Detectar cartas que no han salido en las últimas rondas de modo 1x1 y mostrar un banner visual: "¡Esta carta no ha salido! Si la eliges ahora, tus aciertos valen x2".
*   **Contador de Oportunidad Perdida:** Rastrear si el usuario cambió su elección y, en el siguiente tiro 1x1, salió la carta que acababa de abandonar.

### 3. Economía y Atributos Visuales
*   **Fichas:** Saldo inicial 1000. Regla fija: Acierto = +10, Fallo = -10.
*   **Interfaz:**
    *   **Cabecera:** Título del juego y el mito: *"Si una carta no ha salido en mucho tiempo, ahora es más probable."*. Explicación de la Falacia del Jugador.
    *   **Animación:** Efecto visual de "flip" 3D y animación de barajado.
    *   **Frecuencímetro:** Tabla dinámica que muestre cuántas veces ha salido cada una de las 20 cartas (acumulado de todas las sesiones).
    *   **Marcadores:** Contador de aciertos totales y contador de "oportunidades perdidas".

### Requisitos Técnicos:
*   **Controller:** `presentation/controllers/game3_controller.js` gestiona frecuencias y estados. El modo Full 20 debe garantizar que no se repitan números.
*   **View:** `presentation/views/game3_cartas.html` selector de modo y frecuencímetro. Sin botón de "intentar de nuevo" redundante.
