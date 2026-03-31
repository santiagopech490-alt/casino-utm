# Prompt: Desarrollo del Juego 2 - ¿Puedes ganarle al casino?

**Rol:** Actúa como un Desarrollador Web Senior experto en Vanilla JS, HTML5 y CSS3, y como un profesor de Probabilidad y Estadística.

**Contexto del Proyecto:** Estoy desarrollando la SPA "CASINO UTM" con "Clean Architecture" y diseño "Glassmorphism" (estilo Windows 11). 

**Tarea:** Escribe el código completo y sin errores para el **"Juego 2: ¿Puedes ganarle al casino?"**. El objetivo es romper el mito: *"Si juegas suficiente tiempo, terminarás ganando"*. 
La mecánica es una ruleta (Verde, Rojo, Negro). El usuario inicia con 100 fichas, apuesta en múltiplos de 10 (máximo 100 por tiro). Si gana, recupera su apuesta y gana lo mismo (1:1). El usuario puede endeudarse hasta un límite de -1000 fichas. El juego debe demostrar cómo la "ventaja de la casa" (los espacios verdes) hace que el jugador pierda a largo plazo.

### Directrices de Diseño (UI/UX Actualizado):
* **Integración de Botones:** Los botones de acción dentro de contenedores (como el "+" en el wallet o los selectores de apuesta) deben integrarse de forma natural. Evita el "diseño de burbuja sobre burbuja" (no uses clases de botones con bordes gruesos dentro de paneles que ya tienen bordes).
* **Centrado y Alineación:** Usa `display: flex` y `align-items: center` rigurosamente. Todos los elementos (iconos, números, texto) deben estar perfectamente centrados en sus ejes.
* **Animaciones Sutiles:** Elimina animaciones innecesarias de escalado (`scale`) o desplazamientos bruscos en botones pequeños. Prefiere transiciones suaves de opacidad, color de fondo o `text-shadow` para el feedback visual.
* **Espaciado:** Utiliza la propiedad `gap` en contenedores flex para mantener una separación consistente sin depender de márgenes manuales.

* **Integración de Sonido:** Implementa retroalimentación auditiva mediante `sound_manager.js` para las siguientes acciones:
    * Selección de color (`click`).
    * Realización de apuesta (`chip_bet`).
    * Giro de la ruleta (`roulette_spin`).
    * Detención de la ruleta (`roulette_stop`).
    * Victoria (`slot_win`) y Pérdida (`miss`).
    * Errores de saldo (`error`).

### Requisitos técnicos y Archivos a generar:

**1. `presentation/views/game2_ruleta.html` (Solo fragmento HTML):**
* Estructura Glassmorphism. Cabecera con título y el mito: *"Si juegas suficiente tiempo, terminarás ganando"*.
* **Sección del Mito:** Justo debajo del título, incluir el texto del mito y una breve explicación estática o dinámica que resuma cómo se rompió esta creencia mediante el análisis de la ventaja de la casa y la esperanza matemática negativa.
* Contenedor dinámico de "Análisis de Probabilidad" para mostrar datos en tiempo real de por qué este mito es falso (esperanza matemática).
* Contenedor visual para la Ruleta animada (puede ser CSS o un elemento circular dividido) y un indicador de resultado.
* Controles de Apuesta: Botones o un selector para elegir color (Rojo, Negro, Verde). Selector de cantidad a apostar (de 10 en 10, tope de 100 por tiro).
* Botones de Acción: "Apostar y Girar" (centrado y destacado).
* Dashboard interno (tarjetas glass): Fichas Actuales (inicia en 100), Fichas Apostadas, Historial de Resultados, y Número de Rondas.
* Contenedor de conclusión (oculto).

**2. `domain/probability_engine.js` (Actualización - Lógica Pura):**
* Exportar función `spinRoulette()` que devuelva un resultado basado en la ruleta (1 Verde, 18 Rojos, 18 Negros). Para consistencia visual con el diseño CSS, se utilizará un mapeo simplificado: 0 es Verde, números Impares son Rojos y números Pares son Negros.
* Exportar función `calculatePayout(betAmount, betColor, resultColor)` para devolver las ganancias o pérdidas netas. (Rojo/Negro paga 1:1, Verde paga 35:1).

**3. `domain/game_rules.js` (Nuevo - Reglas de Negocio):**
* Exportar función `validateBet(currentChips, betAmount)` para asegurar que la apuesta sea en múltiplos de 10, máximo 100, y no exceda el límite de deuda (-1000).

**4. `presentation/controllers/game2_controller.js` (Orquestador UI):**
* **Gestión de Estado:** Reiniciar el historial y rondas en cada llamada a `initGame2`.
* Importar lógica matemática, reglas de negocio y `sound_manager.js`.
* Estado local: Fichas, límite de deuda, color seleccionado, apuesta actual.
* Lógica al Girar: Validar apuesta, restar fichas, animar la ruleta calculando la rotación precisa para que el puntero coincida con el color y número del resultado, obtener resultado, aplicar ganancias y actualizar el DOM.
* **Explicación del Mito:** Tras 10 rondas o al alcanzar una deuda significativa, mostrar dinámicamente que la "ventaja de la casa" (el cero verde) hace que la **Esperanza Matemática sea negativa (-2.7%)**, asegurando que el casino siempre gane a largo plazo.
* Lógica de "Bancarrota" (al llegar a -1000): Ocultar controles y mostrar conclusión final rompiendo el mito con los datos reales de la sesión.

**5. `assets/css/game2.css`:**
* Estilos para la ruleta (colores neón rojo, verde, negro) y animación de giro (`@keyframes spin`).
* Estilos para fichas de casino y advertencia visual (ej. texto rojo) cuando el usuario entra en números negativos (deuda).

**Restricción:** Asegúrate de que los selectores JS coincidan con el HTML. Explica en los comentarios del código de conclusión cómo la "Esperanza Matemática" hace imposible ganar a largo plazo.