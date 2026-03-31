# Especificación Técnica: Capa de Datos y Persistencia JSON (Casino-UTM)

## 1. Contexto del Proyecto
- **Objetivo:** Implementar la persistencia de datos para una aplicación web educativa de 8 juegos de azar.
- **Arquitectura:** Clean Architecture. Se requiere crear el módulo en la carpeta `/data` o `/infrastructure`.
- **Formato de datos:** Estructura estrictamente en JSON.

## 2. Definición del Módulo
- **Nombre del archivo:** `data/json_repository.js` y `domain/wallet_manager.js` (si es necesario actualizarlo).
- **Propósito:** Actuar como la única fuente de la verdad (Single Source of Truth) para el estado global del usuario, el saldo de fichas y las estadísticas de los 8 juegos.

## 3. Estructura del JSON (Schema)
El sistema debe manejar un objeto JSON centralizado con esta estructura base:
```json
{
  "usuario": "Estudiante",
  "wallet_balance": 1000,
  "global_stats": {
    "total_apostado": 0,
    "total_ganado": 0
  },
  "juegos": {
    "juego1": { "jugado": false, "intentos": 0, "victorias": 0 },
    "juego2": { "jugado": false, "intentos": 0, "victorias": 0 },
    "juego3": { "jugado": false, "intentos": 0, "victorias": 0 },
    "juego4": { "jugado": false, "intentos": 0, "victorias": 0 },
    "juego5": { "jugado": false, "intentos": 0, "victorias": 0 },
    "juego6": { "jugado": false, "intentos": 0, "victorias": 0 },
    "juego7": { "jugado": false, "intentos": 0, "victorias": 0 },
    "juego8": { "jugado": false, "intentos": 0, "victorias": 0 }
  }
}