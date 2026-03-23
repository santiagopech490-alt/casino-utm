# Prompt: Desarrollo del Juego 2 - ¿Puedes ganarle al casino?

**Rol:** Actúa como un Desarrollador Web Senior experto en Vanilla JS, HTML5 y CSS3, y como un profesor de Probabilidad y Estadística.

**Contexto del Proyecto:** Estoy desarrollando la SPA "CASINO UTM" con "Clean Architecture" y diseño "Glassmorphism" (estilo Windows 11). 

**Tarea:** Escribe el código completo y sin errores para el **"Juego 2: ¿Puedes ganarle al casino?"**. El objetivo es romper el mito: *"Si juegas suficiente tiempo, terminarás ganando"*. 
La mecánica es una ruleta (Verde, Rojo, Negro). El usuario inicia con 100 fichas, apuesta en múltiplos de 10 (máximo 100 por tiro). Si gana, recupera su apuesta y gana lo mismo (1:1). El usuario puede endeudarse hasta un límite de -1000 fichas. El juego debe demostrar cómo la "ventaja de la casa" (los espacios verdes) hace que el jugador pierda a largo plazo.

### Requisitos técnicos y Archivos a generar:

**1. `presentation/views/game2_ruleta.html` (Solo fragmento HTML):**
* Estructura Glassmorphism. Cabecera con título y mito.
* Contenedor visual para la Ruleta animada (puede ser CSS o un elemento circular dividido) y un indicador de resultado.
* Controles de Apuesta: Botones o un selector para elegir color (Rojo, Negro, Verde). Selector de cantidad a apostar (de 10 en 10, tope de 100 por tiro).
* Botones de Acción: "Apostar y Girar" y "Retirarse".
* Dashboard interno (tarjetas glass): Fichas Actuales (inicia en 100), Fichas Apostadas, Historial de Resultados, y Número de Rondas.
* Contenedor de conclusión (oculto).

**2. `domain/probability_engine.js` (Actualización - Lógica Pura):**
* Exportar función `spinRoulette()` que devuelva un resultado basado en la ruleta europea (1 Verde, 18 Rojos, 18 Negros). Probabilidades reales: Verde ~2.7%, Rojo ~48.6%, Negro ~48.6%.
* Exportar función `calculatePayout(betAmount, betColor, resultColor)` para devolver las ganancias o pérdidas netas. (Rojo/Negro paga 1:1, Verde usualmente paga más, ej. 14:1 o 35:1, define uno que mantenga la ventaja de la casa).

**3. `domain/game_rules.js` (Nuevo - Reglas de Negocio):**
* Exportar función `validateBet(currentChips, betAmount)` para asegurar que la apuesta sea en múltiplos de 10, máximo 100, y no exceda el límite de deuda (-1000).

**4. `presentation/controllers/game2_controller.js` (Orquestador UI):**
* Importar lógica matemática y reglas de negocio.
* Estado local: Fichas (100 inicial), límite (-1000), color seleccionado, apuesta actual.
* Lógica al Girar: Validar apuesta, restar fichas temporalmente, animar la ruleta (esperar asíncronamente), obtener resultado, aplicar ganancias/pérdidas, y actualizar el DOM.
* Lógica de "Retirarse" o "Bancarrota" (al llegar a -1000): Ocultar controles, mostrar panel de conclusión explicando que la ventaja matemática de la casa (por el Verde) garantiza que a la larga el valor esperado del jugador es negativo, rompiendo el mito.

**5. `assets/css/game2.css`:**
* Estilos para la ruleta (colores neón rojo, verde, negro) y animación de giro (`@keyframes spin`).
* Estilos para fichas de casino y advertencia visual (ej. texto rojo) cuando el usuario entra en números negativos (deuda).

**Restricción:** Asegúrate de que los selectores JS coincidan con el HTML. Explica en los comentarios del código de conclusión cómo la "Esperanza Matemática" hace imposible ganar a largo plazo.