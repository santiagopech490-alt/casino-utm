---
goal: Implementar un sistema de notificaciones de victoria (Victory Modal) global para Casino UTM
version: 1.0
date_created: 2026-03-27
last_updated: 2026-03-27
owner: Gemini CLI
status: 'Planned'
tags: ['feature', 'ui', 'gamification']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Este plan detalla la implementación de un sistema de modales de victoria unificado para todos los minijuegos del Casino UTM. El objetivo es proporcionar un feedback visual y auditivo claro cuando el usuario gana fichas, asegurando que el saldo se actualice correctamente y el flujo del juego sea fluido (reinicio automático al cerrar el modal).

## 1. Requirements & Constraints

- **REQ-001**: El modal debe seguir el estilo Glassmorphism definido en `assets/css/glass-theme.css`.
- **REQ-002**: Debe mostrar dinámicamente el nombre del juego, un icono (emoji) y la cantidad de fichas ganadas.
- **REQ-003**: Al cerrar el modal, el juego actual debe reiniciarse (`resetGame`).
- **REQ-004**: Se debe disparar un sonido de victoria (`slot_win` o `jackpot`) al mostrar el modal.
- **REQ-005**: El saldo en la barra superior (`#wallet-balance`) debe reflejar la ganancia inmediatamente.
- **CON-001**: No se deben modificar las reglas de probabilidad de los juegos existentes.
- **PAT-001**: Utilizar el `WalletManager` y `SoundManager` existentes para la lógica de negocio.

## 2. Implementation Steps

### Fase 1: Infraestructura de UI y Estilos

- GOAL-001: Crear la estructura del modal en el HTML base y definir estilos adicionales si es necesario.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Agregar el template del `victory-modal` en `index.html` (similar al `wallet-modal`). | | |
| TASK-002 | Asegurar que `assets/css/glass-theme.css` tenga las animaciones y clases necesarias para el estado de victoria (ej. `.text-neon-green`). | | |

### Fase 2: Lógica Centralizada de Modales

- GOAL-002: Crear un helper de UI para gestionar la apertura y cierre del modal de victoria de forma genérica.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-003 | Crear `presentation/components/victory_modal.js` con una función `showVictory(gameName, amount, icon, onConfirm)`. | | |
| TASK-004 | Integrar `SoundManager.playSound('slot_win')` dentro de `showVictory`. | | |

### Fase 3: Integración en Controladores de Juego

- GOAL-003: Modificar los controladores de los 8 juegos para disparar el modal en el momento adecuado.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | **Juego 1 (Falacia):** Trigger en `handleSingleFlip` cuando `result === gameState.userCurrentChoice`. | | |
| TASK-006 | **Juego 2 (Ruleta):** Identificar condición de acierto en el controlador y disparar modal. | | |
| TASK-007 | **Juego 3 al 8:** Repetir el proceso de identificación de victoria y llamada a `showVictory`. | | |
| TASK-008 | Asegurar que el callback `onConfirm` de `showVictory` llame a `resetGame()` en cada controlador. | | |

## 3. Alternatives

- **ALT-001**: Implementar un modal específico por cada archivo HTML de juego. *Descartado por falta de mantenibilidad y redundancia de código.*
- **ALT-002**: Usar una librería externa como SweetAlert2. *Descartado para mantener el peso ligero y el estilo Glassmorphism personalizado.*

## 4. Dependencies

- **DEP-001**: `domain/wallet_manager.js` para actualización de saldo.
- **DEP-002**: `domain/sound_manager.js` para efectos de audio.
- **DEP-003**: `assets/css/glass-theme.css` para consistencia visual.

## 5. Files

- **FILE-001**: `index.html` (Estructura base del modal).
- **FILE-002**: `presentation/components/victory_modal.js` (Nuevo componente).
- **FILE-003**: `presentation/controllers/game1_controller.js` a `game8_controller.js` (Integración).

## 6. Testing

- **TEST-001**: Verificar que el modal aparece solo cuando el usuario gana.
- **TEST-002**: Confirmar que el saldo aumenta exactamente en la cantidad mostrada en el modal.
- **TEST-003**: Validar que el sonido se reproduce al abrir el modal.
- **TEST-004**: Asegurar que el botón "Continuar" reinicia el tablero del juego sin recargar la página.

## 7. Risks & Assumptions

- **RISK-001**: Conflictos de Z-index con otros elementos glassmorphism.
- **ASSUMPTION-001**: Todos los controladores tienen una función `resetGame` o similar exportada o accesible.

## 8. Related Specifications / Further Reading

- [Prompts Implementations](../../prompts/implementations.md)
- [Glassmorphism UI Guide](../../assets/css/glass-theme.css)
