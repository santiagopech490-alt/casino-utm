Implementar un sistema de notificaciones de victoria (Victory Modal) para todos los juegos del Casino UTM, asegurando la actualización del saldo y el reinicio de la partida.

**DESIGN SYSTEM (REQUIRED):**
- **Platform:** Web, Desktop-first.
- **Theme:** Glassmorphism / Windows 11 Style (Dark Mode).
- **Background:** Glass Panel (`rgba(255, 255, 255, 0.03)` with `16px` blur).
- **Primary Accent:** Neon Purple (`rgba(138, 43, 226, 0.5)`) para elementos interactivos.
- **Success Accent:** Emerald Green (`#00ff88`) para conteo de fichas y mensajes de victoria.
- **Typography:** Soft Neon (`#e0d4ff`) para encabezados.
- **Components:** Utilizar las clases `.modal-overlay` y `.glass-panel.modal-content` definidas en `assets/css/glass-theme.css`.

**Objetivos Técnicos:**
1. **Análisis de Flujo:** Identificar en cada controlador (`presentation/controllers/game*_controller.js`) el estado exacto de "Victoria" o "Fin de Juego" donde se calculan las ganancias.
2. **Modal de Victoria Dinámico:** Implementar un modal que se superponga al juego actual utilizando la estructura:
    - **Icono:** Un emoji animado (clase `.modal-emoji`) distintivo de cada juego.
    - **Título:** Mensaje de éxito incluyendo el nombre del juego (ej: "¡Victoria en Ruleta!").
    - **Resultado:** Visualización destacada de las "Fichas Ganadas".
    - **Acción:** Botón "Continuar" que cierre el modal y ejecute la función de reinicio (`reset`) del controlador correspondiente.
3. **Gestión de Saldo (Wallet):** Integrar la lógica para actualizar el elemento `#wallet-balance` en la `topbar`. Coordinar con `domain/wallet_manager.js` para asegurar la persistencia del saldo.
4. **Feedback Auditivo:** Invocar el método de sonido de victoria a través de `domain/sound_manager.js` en el momento preciso de la aparición del modal.

**Archivos de Referencia:**
- **Estilos:** `assets/css/glass-theme.css` (revisar animaciones `@keyframes bounce`).
- **Lógica de Juegos:** `presentation/controllers/` (game1 a game8).
- **Estructura Global:** `index.html` (para asegurar la correcta jerarquía del modal en el DOM).
- **Managers de Dominio:** `domain/wallet_manager.js` y `domain/sound_manager.js`.

---
💡 **Tip:** Para mantener la consistencia visual, utiliza la clase `.text-neon-green` (si está disponible) o el color `#00ff88` para resaltar el monto de las fichas ganadas dentro del modal.
