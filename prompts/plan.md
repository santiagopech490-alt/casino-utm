# Prompt: Desarrollo del Juego 1 - La Falacia del Jugador

**Rol:** Actúa como un Desarrollador Web Senior experto en Vanilla JS, HTML5 y CSS3, y como un profesor de Probabilidad y Estadística.

**Contexto del Proyecto:** Estoy desarrollando una Single Page Application (SPA) llamada "CASINO UTM" para la materia de Probabilidad y Estadística (Carrera: DSM). El diseño visual debe ser estrictamente "Glassmorphism" (estilo Windows 11: fondos difuminados con `backdrop-filter: blur`, bordes semitransparentes, sombras suaves y acentos de colores neón). Estoy utilizando una "Clean Architecture" separando las vistas (HTML), los controladores (JS UI), el dominio (JS Lógica matemática) y los estilos (CSS).

**Tarea:** Necesito que escribas el código completo y sin errores para el **"Juego 1: La falacia del jugador"**. El objetivo de este juego es demostrar matemáticamente que el mito *"Si algo ha pasado muchas veces seguidas, ahora es menos probable que vuelva a pasar"* es falso, evidenciando que los eventos son independientes y la probabilidad siempre es 50/50.

### Requisitos técnicos y Archivos a generar:

**1. `presentation/views/game1_falacia.html` (Solo el fragmento HTML, sin body/head):**
* Estructura con clases CSS para el panel Glassmorphism.
* Cabecera con el título y el texto del mito.
* Un contenedor para una moneda animada en 3D (Cara/Cruz) y una línea de tiempo visual (burbujas) con los últimos 10 resultados.
* Botones de control: Elegir "Cara" o "Cruz", botón para "Lanzar 1x1" (deshabilitado hasta elegir opción) y botón "Simular 20 lanzamientos" (lanzamiento rápido o *batch*).
* Un dashboard interno (tarjetas glass) mostrando: Total de lanzamientos, conteo y porcentaje de Caras, conteo y porcentaje de Cruces, y Aciertos del usuario.
* Un contenedor de conclusión (oculto inicialmente) que se mostrará al final.

**2. `domain/probability_engine.js` (Lógica Pura):**
* Exportar función `flipCoinPure()` que use `Math.random() < 0.5` para garantizar un 50/50 estricto.
* Exportar función para simular lanzamientos en lote (batch).
* Exportar función que calcule las estadísticas (totales y porcentajes) a partir de un array de historial.

**3. `presentation/controllers/game1_controller.js` (Orquestador de UI):**
* Importar el motor matemático.
* Manejar el estado local: historial completo, elección del usuario, aciertos.
* Añadir *Event Listeners* a los botones de la vista.
* Lógica para "Lanzar 1x1": Llamar al motor, sumar aciertos si adivinó, ejecutar una función asíncrona que espere a que termine la animación CSS de la moneda, y actualizar el DOM.
* Lógica para "Simular 20": Añadir 20 resultados al historial sin animación lenta y actualizar el DOM de golpe.
* Mostrar el panel de conclusión automáticamente cuando el historial llegue a 15 lanzamientos, explicando que la moneda no tiene memoria.

**4. `assets/css/game1.css`:**
* Estilos específicos para la moneda en 3D (`transform-style: preserve-3d`) y las clases de animación (`@keyframes`) para que gire múltiples veces y aterrice en la cara correcta.
* Estilos para las tarjetas de estadísticas, la línea de tiempo y los botones activos.

**Restricción:** Asegúrate de que los selectores en el JS coincidan exactamente con los IDs y clases del HTML generado. Comenta el código JS explicando cómo se rompe el mito.