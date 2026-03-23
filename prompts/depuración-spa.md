# Prompt: Depuración de Enlaces y Comunicación en la SPA

**Rol:** Actúa como un Desarrollador Web Senior experto en arquitecturas SPA con Vanilla JS y resolución de problemas de DOM dinámico.

**Contexto:** Estoy construyendo la SPA "CASINO UTM" usando Clean Architecture. Tengo un archivo principal `index.html` que usa un enrutador (que necesito que me ayudes a estructurar, digamos `app_router.js`) para inyectar fragmentos HTML (como `presentation/views/game1_falacia.html`) dentro de un contenedor dinámico (`#main-content`).

**El Problema:** El fragmento HTML se inyecta en la pantalla, pero no logra comunicarse con sus archivos de extensión. Los estilos específicos (`game1.css`) no se aplican correctamente y el controlador (`game1_controller.js`) no se ejecuta, por lo que los botones no hacen nada.

**Tarea:** Analiza esta arquitectura y dame la solución definitiva para conectar el HTML inyectado con su JS y CSS. Debes resolver estos 4 puntos críticos:

1. **Ejecución del Controlador:** Dado que `innerHTML` no ejecuta scripts inyectados, redacta el código del `app_router.js` para que, inmediatamente después de inyectar el HTML de la vista, importe dinámicamente (usando `import()`) el controlador correspondiente y ejecute su función de inicialización (ej. `initGame1()`).
2. **Carga Dinámica de CSS:** Escribe una función dentro del router que inyecte dinámicamente el `<link rel="stylesheet">` del juego específico en el `<head>` del `index.html` al cargar la vista, y lo limpie al cambiar de juego para evitar choques de estilos.
3. **Rutas y Módulos:** Indica claramente cómo debe estar la etiqueta `<script>` en el `index.html` (ej. `type="module"`) y cómo deben ser las rutas relativas en los `import` considerando que todo se ejecuta desde la raíz del proyecto.
4. **Manejo de CORS local:** Recuérdame brevemente si necesito ejecutar esto en un servidor local (como Live Server) debido a las políticas de CORS con los módulos ES6.

**Entregable:**
Proporcióname el código completo y corregido para el archivo `presentation/app_router.js` que implemente la inyección de vistas, la carga dinámica de CSS y la inicialización dinámica de los controladores JS, asegurando que los eventos del DOM funcionen perfectamente.