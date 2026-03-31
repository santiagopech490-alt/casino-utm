# Prompt: Desarrollo del Juego 1 - La Falacia del Jugador

**Rol:** Actúa como un Desarrollador Web Senior experto en Vanilla JS, HTML5 y CSS3, y como un profesor de Probabilidad y Estadística.

**Contexto del Proyecto:** Estoy desarrollando una Single Page Application (SPA) llamada "CASINO UTM" para la materia de Probabilidad y Estadística. El diseño visual es "Glassmorphism" (estilo Windows 11). El sistema cuenta con un **Wallet Global** (`domain/wallet_manager.js`) que gestiona las fichas del usuario.

**Tarea:** Escribe el código completo y sin errores para el **"Juego 1: La falacia del jugador"**. El objetivo es demostrar que los eventos son independientes y la probabilidad siempre es 50/50, rompiendo el mito: *"Si algo ha pasado muchas veces seguidas, ahora es menos probable que vuelva a pasar"*.

### Directrices de Diseño (UI/UX Actualizado):
* **Integración de Botones:** Los botones de acción deben integrarse de forma natural. Evita el "diseño de burbuja sobre burbuja" (no uses clases de botones con bordes gruesos dentro de paneles que ya tienen bordes).
* **Centrado y Alineación:** Usa `display: flex` y `align-items: center` rigurosamente. Todos los elementos (iconos, números, texto) deben estar perfectamente centrados en sus ejes.
* **Animaciones Sutiles:** Elimina animaciones innecesarias de escalado agresivo. Prefiere transiciones suaves de opacidad, color de fondo o `text-shadow`. La animación de la moneda debe ser fluida pero el feedback de los botones debe ser discreto.
* **Espaciado:** Utiliza la propiedad `gap` en contenedores flex para mantener una separación consistente sin depender de márgenes manuales.

### Requisitos técnicos y Archivos a generar:

**1. `presentation/views/game1_falacia.html` (Solo fragmento HTML):**
* Estructura Glassmorphism. Cabecera con título y el mito: *"Si algo ha pasado muchas veces seguidas, ahora es menos probable que vuelva a pasar"*.
* Contenedor dinámico de "Análisis Estadístico" (debajo del mito) para mostrar la breve explicación de cómo se rompe la falacia.
* Contenedor para una moneda animada (Cara/Cruz) y una línea de tiempo visual (burbujas) con los últimos resultados.
* Controles de Apuesta: Selector de cantidad (múltiplos de 10 con botones +/- y visualización neón), selección de "Cara" o "Cruz".
* Botones de Acción: "Lanzar 1x1" (habilitado tras elegir cara/cruz) y "Simular 20 lanzamientos" (batch estadístico).
* Dashboard interno (tarjetas glass): Total lanzamientos, Porcentajes C/X, Aciertos/Fallos del usuario y actualización en tiempo real del Wallet.
* Contenedor de conclusión (oculto inicialmente) que resume la ruptura del mito.

**2. `domain/probability_engine.js` (Lógica Pura):**
* Exportar función `flipCoinPure()` para un 50/50 estricto.
* Exportar función para simular lanzamientos en lote (batch).
* Exportar función para calcular estadísticas (totales y porcentajes).

**3. `presentation/controllers/game1_controller.js` (Orquestador UI):**
* **Gestión de Estado:** El estado local (`history`, `wins`, etc.) debe reiniciarse cada vez que se llama a `initGame1` para evitar persistencia errónea entre sesiones de juego.
* **Importaciones Robustas:** Importar motor matemático, `domain/wallet_manager.js`, `domain/game_rules.js` y `domain/sound_manager.js`.
* **Manejo de Audio:** Usar únicamente sonidos existentes en `sound_manager.js` (`click`, `chip_bet`, `reveal`, `error`).
* **Lógica al Lanzar:** Validar apuesta con el Wallet, restar fichas, ejecutar animación asíncrona, aplicar ganancias (1:1 si acierta) y actualizar el DOM.
* **Lógica de Simulación (Batch):** Añadir resultados al historial rápidamente para observar la tendencia al 50%.
* **Explicación del Mito:** Al llegar a 15 lanzamientos o tras una simulación batch, mostrar dinámicamente la explicación de que "la moneda no tiene memoria": cada lanzamiento es un evento independiente con P=0.5, demostrando que el mito es solo una percepción errónea del azar.

**4. `assets/css/game1.css`:**
* Estilos para la moneda (animación de giro 3D) y las burbujas de la línea de tiempo.
* Estilos para las tarjetas de estadísticas alineados con el tema general del casino.

**Restricción:** Asegúrate de que los selectores JS coincidan con el HTML. Comenta el código explicando cómo se rompe el mito matemáticamente. Evita el uso de variables globales fuera del módulo del controlador.
