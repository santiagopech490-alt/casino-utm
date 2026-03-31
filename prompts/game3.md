# Prompt: Desarrollo del Juego 3 - La Carta que Nunca Sale (Simulador de Mazo de 20)

**Rol:** Actúa como un Desarrollador Web Senior experto en Vanilla JS y Psicología del Juego.

**Contexto:** SPA "CASINO UTM" con diseño Glassmorphism y Wallet Global.

**Tarea:** Implementar un simulador de mazo de 20 cartas con reposición total, siguiendo estas especificaciones:

### 1. Lógica de Sorteo y Aleatoriedad
*   **Reposición Total:** Las cartas salen con reposición (pueden repetirse y algunas pueden no aparecer).
*   **Modos de Robo:**
    *   **1x1:** El usuario selecciona su carta (1-20) y se genera un resultado único.
    *   **Full 20:** El usuario selecciona una carta y se generan 20 resultados simultáneos.

### 2. Sistema de Incentivos (Psicología)
*   **Algoritmo Hot/Cold:** Detectar cartas que no han salido en las últimas rondas (ej. últimas 20 tiradas) y mostrar un banner visual: "¡Esta carta no ha salido! Si la eliges ahora, tus aciertos valen x2".
*   **Contador de Oportunidad Perdida:** Rastrear si el usuario cambió su elección y, en el siguiente tiro, salió la carta que acababa de abandonar. Incrementar un contador visual.

### 3. Economía y Atributos Visuales
*   **Fichas:** Saldo inicial 1000. Regla fija: Acierto = +10, Fallo = -10.
*   **Interfaz:**
    *   **Cabecera:** Título del juego y el mito: *"Si una carta no ha salido en mucho tiempo, ahora es más probable."*. Justo debajo, una breve explicación de cómo se rompió este mito (Falacia del Jugador) explicando la independencia de los eventos en un mazo con reposición total.
    *   **Animación:** Efecto visual de "flip" 3D y animación de barajado (shuffle) al reiniciar el tablero.
    *   **Frecuencímetro:** Tabla dinámica que muestre cuántas veces ha salido cada una de las 20 cartas.
    *   **Marcadores:** Contador de aciertos totales y contador de "oportunidades perdidas" (pérdidas por cambio de carta).

### Requisitos Técnicos:
*   **Controller:** `presentation/controllers/game3_controller.js` debe gestionar el estado de frecuencias, historia reciente y rastreo de cambios de carta.
*   **View:** `presentation/views/game3_cartas.html` debe incluir el selector de modo, el frecuencímetro y los banners de incentivos.
*   **CSS:** `assets/css/game3.css` debe implementar la animación de flip y los estilos para el frecuencímetro en rejilla.
